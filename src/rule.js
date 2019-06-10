import {
  EMPTY,
  catchError,
  concat,
  defer,
  distinct,
  from,
  fromArray,
  map,
  mergeMap,
  of,
  pluck,
  single
} from './observable';

import _ from 'lodash/fp';
import {ajv} from './ajv';
import {createDebugger} from './debug';

export const kRuleId = Symbol('ruleId');
export const kRuleMeta = Symbol('ruleMeta');
export const kRuleInspect = Symbol('ruleInspect');
export const kRuleFilepath = Symbol('ruleFilepath');

const debug = createDebugger(module);

/**
 * @typedef {Object} RuleDefinition
 * @property {Object} meta - (schema for `meta` prop)
 * @property {Function} inspect - Async function which receives `Context` object and optional configuration
 */

/**
 * @typedef {Object} Message
 * @property {string} message - Message text
 * @property {?*} data - Optional extra data
 * @property {string} severity - Message severity
 * @property {?string} filepath - Filepath to report (if any)
 * @property {string} id - Rule ID
 */

const validatorMap = new WeakMap();

/**
 * A Rule which can be matched against a Context
 */
export class Rule {
  /**
   *
   * @param {RuleDefinition} ruleDef
   */
  constructor(ruleDef) {
    ruleDef = Rule.applyDefaults(ruleDef);
    Object.assign(this, {
      [kRuleInspect]: ruleDef.inspect,
      [kRuleMeta]: ruleDef.meta,
      [kRuleId]: ruleDef.id,
      [kRuleFilepath]: ruleDef.filepath
    });
  }

  get id() {
    return this[kRuleId];
  }

  get description() {
    return _.get('docs.description', this[kRuleMeta]);
  }

  get url() {
    return _.get('docs.url', this[kRuleMeta]);
  }

  get schema() {
    return _.get('schema', this[kRuleMeta]);
  }

  /**
   * Ripped off much of this from ESLint
   */
  get validate() {
    if (validatorMap.has(this)) {
      debug(`returning cached validator for rule ${this.id}`);
      return validatorMap.get(this);
    }

    const schema = this.schema;

    if (!schema) {
      return _.noop;
    }

    debug(`found schema for rule ${this.id}`, schema);
    const validate = ajv.compile(schema);

    if (ajv.errors) {
      throw new Error(
        `Schema for rule ${this.id} is invalid: ${ajv.errorsText()}`
      );
    }

    validatorMap.set(this, config => {
      debug(`validating ${this.id} with config`, config);
      validate(config);
      if (ajv.errors) {
        throw new Error(`Invalid rule configuration: ${ajv.errorsText()}`);
      }
    });

    return validatorMap.get(this);
  }

  get filepath() {
    return this[kRuleFilepath];
  }

  get meta() {
    return this[kRuleMeta];
  }

  static applyDefaults(ruleDef) {
    return _.defaultsDeep(
      {
        meta: {docs: {}},
        inspect: () => {
          throw new Error(
            `Rule "${ruleDef.id}" has no "inspect" implementation`
          );
        }
      },
      ruleDef
    );
  }

  static normalizeHandler() {
    return observable =>
      observable.pipe(
        map(handler => (_.isFunction(handler) ? {next: handler} : handler))
      );
  }

  /**
   * Calls the `inspect()` function of a Rule impl, which will return one or more
   * "handler" functions.
   * @param {Object} [config] Optional rule-specific config
   * @returns {Promise<Object|Function>}
   */
  async handlers(config = {}) {
    return this[kRuleInspect].call(null, config);
  }

  /**
   * Given a stream of Report objects and an optional configuration, execute
   * the `inspect()` function of the rule, which should return a "next" function,
   * or an object having function props `next` and `complete`.  Runs the "next"
   * handlers against each Report, and finally the "complete" handler (if it exists).
   * These will return one or more partial Message objects or just strings.
   * Ensures Messages are unique, then adds some metadata and reformats for output.
   * @param {Observable<Report>} contexts - Report objects
   * @param {Object} [config] - Optional rule-specific config
   * @returns {Observable<Message>}
   */
  inspect({contexts, config = {}}) {
    return from(this.handlers(config)).pipe(
      Rule.normalizeHandler(),
      mergeMap(handler =>
        concat(
          contexts.pipe(
            mergeMap(context =>
              fromArray(handler.next(context)).pipe(
                map(message => [message, context.filepath])
              )
            )
          ),
          _.isFunction(handler.complete)
            ? defer(() =>
                // if we only have a single context, use that filepath, otherwise
                // emit "multiple files" for the `filepath`
                contexts.pipe(
                  pluck('filepath'),
                  single(),
                  catchError(() => of('(multiple files)')),
                  mergeMap(filepath =>
                    fromArray(handler.complete()).pipe(
                      map(message => [message, filepath])
                    )
                  )
                )
              )
            : EMPTY
        )
      ),
      distinct(),
      Rule.formatResult(this.id)
    );
  }

  static formatResult(id) {
    return observable =>
      observable.pipe(
        map(([message, filepath]) => {
          let data, severity;
          if (_.has('message', message)) {
            data = message.data;
            severity = message.severity;
            message = message.message;
          }
          message = String(message).trim();
          return _.pickBy(Boolean, {message, filepath, id, severity, data});
        })
      );
  }
}

/**
 *
 * @param {RuleDefinition} ruleDef
 */
Rule.create = _.memoize(ruleDef => {
  return new Rule(ruleDef);
});
