import Table from 'cli-table3';
import _ from 'lodash/fp';
import color from 'ansi-colors';
import {version} from '../package.json';

export const outputHeader = headerText =>
  color.grey('[') +
  color.cyanBright('gnostic') +
  ' ' +
  color.cyan(`v${version}`) +
  color.grey('] ') +
  color.magenta(headerText) +
  '\n';

export const table = (headers, opts = {}) => {
  opts = _.defaultsDeep(
    {
      chars: {
        bottom: '',
        'bottom-left': '',
        'bottom-mid': '',
        'bottom-right': '',
        left: '',
        'left-mid': '',
        mid: '─',
        'mid-mid': '',
        middle: '',
        right: '',
        'right-mid': '',
        top: '',
        'top-left': '',
        'top-mid': '',
        'top-right': ''
      },
      style: {head: []},
      wordWrap: true
    },
    opts
  );
  return new Table(_.assign(opts, {head: headers.map(color.underline)}));
};

export const ok = text => color.green('✓') + ' ' + color.greenBright(text);
export const fail = text => color.red('✕') + ' ' + color.redBright(text);
