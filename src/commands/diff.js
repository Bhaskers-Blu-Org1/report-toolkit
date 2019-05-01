import {createTable, outputHeader} from '../console';
import {map, reduce, startWith} from 'rxjs/operators';

import {DIFF_DEFAULT_PROPERTIES} from '../diff-report';
import color from 'ansi-colors';
import {diff$} from '../api';

export const command = 'diff <file1> <file2>';

export const desc = 'Diff two reports';

export const builder = yargs =>
  yargs.options({
    prop: {
      type: 'array',
      nargs: 1,
      description: 'Filter by root prop name',
      default: DIFF_DEFAULT_PROPERTIES,
      group: 'Filter:'
    }
  });

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

export const handler = ({file1, file2, prop: properties} = {}) => {
  diff$(file1, file2, {properties})
    .pipe(
      reduce((t, {path, value, oldValue, op}) => {
        t.push([
          color[OP_COLORS[op]](OP_CODE[op]),
          color[OP_COLORS[op]](path),
          value,
          oldValue
        ]);
        return t;
      }, createTable(['Op', `Path`, `Value [${file1}]`, `Value [${file2}]`], {stretch: true})),
      map(String),
      startWith(outputHeader(`Diff: ${file1} <=> ${file2}`))
    )
    .subscribe(console.log);
};
