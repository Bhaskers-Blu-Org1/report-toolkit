import {_, constants, createDebugPipe, observable} from '@gnostic/common';
import {stream} from '@gnostic/core';
import {toObjectFromFilepath} from '@gnostic/fs';

import {colors, toFormattedString} from '../console-utils.js';
import {FORMAT_TABLE} from '../table-formatter.js';
import {GROUPS, OPTIONS} from './common.js';

const {toReportDiff, toReportFromObject} = stream;
const {DEFAULT_DIFF_OPTIONS} = constants;
const {of} = observable;

const debug = createDebugPipe('cli', 'commands', 'diff');

const OP_COLORS = {
  add: 'green',
  remove: 'red',
  replace: 'yellow'
};
const OP_CODE = {
  add: 'A',
  remove: 'D',
  replace: 'M'
};

export const command = 'diff <file1> <file2>';

export const desc = 'Diff two reports';

export const builder = yargs =>
  yargs.options({
    prop: {
      type: 'array',
      nargs: 1,
      description: 'Filter by property name',
      default: DEFAULT_DIFF_OPTIONS.properties,
      group: GROUPS.FILTER
    },
    ...OPTIONS.OUTPUT
  });

/**
 * @todo handle same-file issue
 * @todo handle output-to-file
 * @param {*} argv
 */
export const handler = argv => {
  const {
    config,
    file1,
    file2,
    prop: properties,
    truncate: truncateValues = true,
    wrap: wrapValues = false,
    format = FORMAT_TABLE,
    pretty = false,
    color,
    showSecretsUnsafe = false
  } = argv;
  of(file1, file2)
    .pipe(
      toObjectFromFilepath(),
      debug(() => config.diff && `using diff-specific options: ${config.diff}`),
      toReportFromObject({
        ...config.diff,
        showSecretsUnsafe,
        disableSort: true
      }),
      debug(report => `created Report from ${report.filepath}`),
      toReportDiff({...config.diff, properties}),
      debug(result => result && `diff generated for ${file1} : ${file2}`),
      toFormattedString(format, {
        color,
        fields: [
          {
            label: 'Op',
            value: row => colors[OP_COLORS[row.op]](OP_CODE[row.op]),
            widthPct: 4
          },
          {
            label: 'Path',
            value: row => colors[OP_COLORS[row.op]](row.path),
            widthPct: 24
          },
          {
            label: file1,
            value: _.get('value'),
            widthPct: 36
          },
          {
            label: file2,
            value: _.get('oldValue'),
            widthPct: 36
          }
        ],
        pretty,
        outputHeader: `Diff: ${file1} <=> ${file2}`,
        truncateValues,
        wrapValues
      })
    )
    .subscribe(console.log);
};
