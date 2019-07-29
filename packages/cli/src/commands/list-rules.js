import {_} from '@report-toolkit/common';
import {fromSearchpathToRuleDefinition} from '@report-toolkit/fs';

// import {toFormattedString} from '../console-utils.js';
import {OPTIONS} from './common.js';

export const command = 'list-rules';

export const desc = 'Lists built-in rules';

export const builder = yargs => yargs.options(OPTIONS.OUTPUT);

export const handler = ({
  color,
  format = 'table',
  pretty = false,
  truncate: truncateValues = true,
  wrap: wrapValues = false
}) => {
  fromSearchpathToRuleDefinition()
    .pipe
    // toFormattedString(format, {
    //   color,
    //   fields: [
    //     {
    //       label: 'Rule',
    //       value: 'id'
    //     },
    //     {
    //       color: row => !row.description && 'dim',
    //       label: 'Description',
    //       value: _.getOr('(no description)', 'description')
    //     }
    //   ],
    //   outputHeader: 'Available Rules',
    //   pretty,
    //   truncateValues,
    //   wrapValues
    // })
    ()
    .subscribe(console.log);
};
