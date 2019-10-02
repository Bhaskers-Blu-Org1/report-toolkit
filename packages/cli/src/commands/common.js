import {
  _,
  constants,
  createDebugger,
  createDebugPipe,
  observable
} from '@report-toolkit/common';
import {observable as observableAPI} from '@report-toolkit/core';
import {toObjectFromFilepath} from '@report-toolkit/fs';

import {terminalColumns} from '../console-utils.js';

const debug = createDebugPipe('cli', 'commands', 'common');

const {
  compatibleTransforms,
  builtinTransformerIds,
  toReportFromObject
} = observableAPI;

const {fromAny, share} = observable;

export const GROUPS = {
  FILTER: 'Filter:',
  FILTER_TRANSFORM: '"filter" Transform Options:',
  JSON_TRANSFORM: '"json" Transform Options:',
  OUTPUT: 'Output:',
  TABLE_TRANSFORM: '"table" Transform Options:'
};

export const OPTIONS = {
  FILTER_TRANSFORM: {
    exclude: {
      coerce: _.castArray,
      description: 'Exclude properties (keypaths allowed)',
      group: GROUPS.FILTER_TRANSFORM,
      type: 'array',
      default: []
    },
    include: {
      coerce: _.castArray,
      description: 'Include properties (keypaths allowed)',
      group: GROUPS.FILTER_TRANSFORM,
      type: 'array',
      default: []
    }
  },
  JSON_TRANSFORM: {
    pretty: {
      description: 'Pretty-print JSON output',
      group: GROUPS.JSON_TRANSFORM,
      type: 'boolean'
    }
  },
  OUTPUT: {
    color: {
      default: true,
      description: 'Use color output where applicable',
      group: GROUPS.OUTPUT,
      type: 'boolean'
    },
    output: {
      alias: 'o',
      description: 'Output to file instead of STDOUT',
      group: GROUPS.OUTPUT,
      normalize: true,
      requiresArg: true,
      type: 'string'
    },
    'show-secrets-unsafe': {
      description: 'Live dangerously & do not automatically redact secrets',
      group: GROUPS.OUTPUT,
      type: 'boolean'
    },
    transform: {
      // @todo list transform aliases
      alias: 't',
      choices: builtinTransformerIds,
      coerce: _.pipe(
        _.castArray,
        _.uniq
      ),
      default: constants.DEFAULT_TRANSFORMER,
      description: 'Transform(s) to apply',
      group: GROUPS.OUTPUT,
      type: 'array'
    }
  },
  TABLE_TRANSFORM: {
    'max-width': {
      defaultDescription: `terminal width (${terminalColumns})`,
      description: 'Set maximum output width; ignored if --no-truncate used',
      group: GROUPS.TABLE_TRANSFORM,
      type: 'number'
    },
    truncate: {
      default: true,
      description: 'Truncate & word-wrap output',
      group: GROUPS.TABLE_TRANSFORM,
      type: 'boolean'
    }
  }
};

export const getOptions = (
  group,
  {
    sourceType = 'report',
    defaultTransformer = constants.DEFAULT_TRANSFORMER
  } = {}
) =>
  group.transform
    ? {
        ...group,
        transform: {
          ...group.transform,
          choices: compatibleTransforms(sourceType),
          default: defaultTransformer
        }
      }
    : group;

/**
 *
 * @param {string[]|string} filepaths
 * @param {*} opts
 */
export function fromFilepathsToReports(filepaths, opts = {}) {
  return fromAny(filepaths).pipe(
    debug(() => `attempting to load filepath(s): ${filepaths}`),
    toObjectFromFilepath(),
    toReportFromObject(opts),
    debug(() => `loaded filepath(s): ${filepaths}`),
    share()
  );
}

/**
 * Compute a configuration for a particular command.  Command-specific
 * config overrides whatever the top-level config is.
 * @param {string} commandName - Name of command
 * @param {object} [argv] - Command-line args
 * @param {object} [defaultConfig] - Default command configuration
 * @returns {object} Resulting config with command-specific stuff on top
 */
export const mergeCommandConfig = (
  commandName,
  argv = {},
  defaultConfig = {}
) => {
  const config = _.omit(
    commandName,
    _.mergeAll([
      _.defaultsDeep(defaultConfig, _.getOr({}, commandName, defaultConfig)),
      _.defaultsDeep(
        _.getOr({}, 'config', argv),
        _.getOr({}, `config.${commandName}`, argv)
      ),
      _.omit(['$0', 'config', '_'], argv)
    ])
  );
  createDebugger('cli', 'commands', 'common')(
    `computed config for command "${commandName}": %O`,
    config
  );
  return config;
};
