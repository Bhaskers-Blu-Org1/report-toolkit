import {from, throwError} from 'rxjs';

import _ from 'lodash/fp';
import {fromArray} from './operators';

export const kRuleId = Symbol('ruleId');
export const kRuleMeta = Symbol('ruleMeta');
export const kRuleInspect = Symbol('ruleInspect');
export const kRuleFilepath = Symbol('ruleFilepath');

/**
 * @typedef {Object} RuleDefinition
 * @property {Object} meta - (schema for `meta` prop)
 * @property {Function} inspect - Async function which receives `Context` object and optional configuration
 */

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

  get filepath() {
    return this[kRuleFilepath];
  }

  get meta() {
    return this[kRuleMeta];
  }

  inspect(context, config = {}) {
    return throwError(new Error('Not implemented'));
  }

  static applyDefaults(ruleDef) {
    return _.defaultsDeep(
      {
        meta: {type: 'info', mode: 'simple', docs: {}},
        inspect: () => {
          throw new Error(
            `Rule "${ruleDef.id}" has no "inspect" implementation`
          );
        }
      },
      ruleDef
    );
  }
}

/**
 *
 * @param {RuleDefinition} ruleDef
 */
Rule.create = _.memoize(ruleDef => {
  const ctor = RULE_MODE_MAP.get(_.getOr('simple', 'meta.mode', ruleDef));
  if (!ctor) {
    throw new Error(`Unknown rule mode ${_.get('meta.mode', ruleDef)}`);
  }
  return Reflect.construct(ctor, [ruleDef]);
});

export class SimpleRule extends Rule {
  /**
   *
   * @param {Context} context - Context object
   * @param {Object} [config] - Optional rule-specific config
   * @returns {Observable}
   */
  inspect({context, config = {}} = {}) {
    return fromArray(this[kRuleInspect].call(null, context, config) || []);
  }
}

export class TemporalRule extends Rule {
  /**
   *
   * @param {Context} context - Context object
   * @param {Object} [config] - Optional rule-specific config
   * @returns {Observable}
   */
  inspect({stream, config = {}} = {}) {
    return from(this[kRuleInspect].call(null, stream, config) || []);
  }
}

const RULE_MODE_MAP = new Map([
  ['simple', SimpleRule],
  ['temporal', TemporalRule]
]);
