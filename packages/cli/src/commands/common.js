import {observable} from '@report-toolkit/common';
import {stream} from '@report-toolkit/core';
import {FORMAT_CSV, FORMAT_JSON} from '@report-toolkit/formatters';
import {toObjectFromFilepath} from '@report-toolkit/fs';

import {FORMAT_TABLE} from '../table-formatter.js';

const {toReportFromObject} = stream;

const {fromAny, share} = observable;

export const GROUPS = {
  FILTER: 'Filter:',
  OUTPUT: 'Output:'
};

export const OPTIONS = {
  OUTPUT: {
    color: {
      default: true,
      description: 'Use colors w/ "table" format',
      group: GROUPS.OUTPUT,
      type: 'boolean'
    },
    format: {
      choices: [FORMAT_CSV, FORMAT_JSON, FORMAT_TABLE],
      default: FORMAT_TABLE,
      description: 'Output format',
      group: GROUPS.OUTPUT
    },
    output: {
      alias: 'o',
      description: 'Output to file instead of STDOUT',
      group: GROUPS.OUTPUT,
      normalize: true,
      requiresArg: true,
      type: 'string'
    },
    pretty: {
      description: 'Pretty-print JSON output',
      group: GROUPS.OUTPUT,
      type: 'boolean'
    },
    'show-secrets-unsafe': {
      description: 'Live dangerously & do not automatically redact secrets',
      group: GROUPS.OUTPUT,
      type: 'boolean'
    },
    truncate: {
      conflicts: 'wrap',
      default: true,
      description: 'Truncate values (table format)',
      group: GROUPS.OUTPUT,
      type: 'boolean'
    },
    wrap: {
      conflicts: 'truncate',
      description:
        'Hard-wrap values (table format only; implies --no-truncate)',
      group: GROUPS.OUTPUT,
      type: 'boolean'
    }
  }
};

export const fromFilepathToReport = (filepaths, opts = {}) =>
  fromAny(filepaths).pipe(
    toObjectFromFilepath(opts),
    toReportFromObject(opts),
    share()
  );
