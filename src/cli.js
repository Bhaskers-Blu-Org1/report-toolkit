import {createDebugger, enableDebugger} from './debug.js';

import pkg from '../package.json';
import {search} from './config';
import yargs from 'yargs/yargs';

const debug = createDebugger('cli');

const GROUP_OUTPUT = 'Output:';

export const main = async () => {
  const configResult = await search();
  let config;
  if (configResult) {
    config = configResult.config;
    debug(`using config at ${configResult.filepath}`);
  } else {
    debug('no config file found');
  }
  yargs()
    .scriptName(pkg.name)
    .commandDir('commands')
    .demandCommand()
    .options({
      verbose: {
        alias: ['v', 'debug'],
        desc: 'Enable verbose output',
        global: true,
        group: GROUP_OUTPUT,
        type: 'boolean'
      }
    })
    .config(config)
    .env(pkg.name)
    .help()
    .fail((msg, err, yargs) => {
      // if `msg` is present, this is a "handled" error.
      if (msg) {
        console.error(`${yargs.help()}\n`);
      }

      if (err) {
        throw err;
      }
    })
    .version()
    .middleware(argv => {
      // "verbose" enables debug statements
      if (argv.verbose) {
        enableDebugger();
      }

      return argv;
    })
    .parse(process.argv.slice(2));
};

process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(1);
});
