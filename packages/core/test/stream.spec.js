import {ERROR} from '@report-toolkit/common/src/constants.js';
import {
  RTKERR_INVALID_PARAMETER,
  RTKERR_INVALID_REPORT
} from '@report-toolkit/common/src/error.js';
import {of, switchMapTo} from '@report-toolkit/common/src/observable.js';
import {isReportLike} from '@report-toolkit/common/src/report.js';
// @ts-ignore
import REPORT_001 from '@report-toolkit/common/test/fixture/reports/report-001.json';
// @ts-ignore
import REPORT_002 from '@report-toolkit/common/test/fixture/reports/report-002-library-mismatch.json';

import * as baz from './fixture/plugins/baz/index.js';

const REPORT_001_FILEPATH = require.resolve(
  '@report-toolkit/common/test/fixture/reports/report-001.json'
);
const REPORT_002_FILEPATH = require.resolve(
  '@report-toolkit/common/test/fixture/reports/report-002-library-mismatch.json'
);

describe('@report-toolkit/core:stream', function() {
  let sandbox;
  /**
   * @type {import('../src/stream')}
   */
  let core;
  let subject;

  const msg001 = {
    filepath: REPORT_001_FILEPATH,
    id: 'foo',
    message: 'foo',
    severity: ERROR
  };

  const msg002 = {
    filepath: REPORT_002_FILEPATH,
    id: 'bar',
    message: 'bar',
    severity: ERROR
  };

  let stubs;

  beforeEach(function() {
    sandbox = sinon.createSandbox();

    stubs = {
      '@report-toolkit/inspector': {
        inspectReports: sandbox
          .stub()
          .returnsOperatorFunction(switchMapTo([msg001, msg002]))
      },
      '@report-toolkit/diff': {
        diffReports: sandbox.stub().returnsOperatorFunction(
          switchMapTo([
            {
              oldValue: 45164,
              op: 'replace',
              path: '/header/processId',
              value: 4658
            },
            {
              oldValue:
                '/Users/boneskull/projects/christopher-hiller/report-toolkit',
              op: 'replace',
              path: '/header/cwd',
              value: '/Users/boneskull/projects/nodejs/node'
            }
          ])
        )
      },
      '@report-toolkit/config': {
        parseConfig: sandbox.stub().returnsOperatorFunction()
      }
    };

    core = proxyquire(require.resolve('../src/stream'), stubs);
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('function', function() {
    describe('diff()', function() {
      /**
       * @type {import('../src/stream').diff}
       */
      let diff;

      beforeEach(function() {
        diff = core.diff;
      });

      it('should diff two reports', function() {
        return expect(
          diff(REPORT_001, REPORT_002),
          'to complete with values',
          {
            oldValue: 45164,
            op: 'replace',
            path: '/header/processId',
            value: 4658
          },
          {
            oldValue:
              '/Users/boneskull/projects/christopher-hiller/report-toolkit',
            op: 'replace',
            path: '/header/cwd',
            value: '/Users/boneskull/projects/nodejs/node'
          }
        );
      });

      it('should fail if fewer than two parameters are supplied', function() {
        // this is invalid usage, so ignore the TS failure
        // @ts-ignore
        return expect(diff(REPORT_001), 'to emit error satisfying', {
          code: RTKERR_INVALID_PARAMETER
        });
      });

      it('should fail if the second parameter is not a report-like object', function() {
        return expect(diff(REPORT_001, {}), 'to emit error satisfying', {
          code: RTKERR_INVALID_REPORT
        });
      });
    });

    describe('inspect()', function() {
      beforeEach(function() {
        subject = core.inspect;
        isReportLike.cache.clear();
      });

      describe('when passed raw report objects', function() {
        it('should emit inspection results for a single report', function() {
          return expect(
            subject(REPORT_002),
            'to complete with values',
            msg001,
            msg002
          );
        });

        it('should emit inspection results for two reports', function() {
          return expect(
            subject([REPORT_002, REPORT_001]),
            'to complete with values',
            msg001,
            msg002
          );
        });
      });

      describe('when passed Observables of raw report objects', function() {
        it('should emit inspection results for a single report', function() {
          return expect(
            subject(of(REPORT_002)),
            'to complete with values',
            msg001,
            msg002
          );
        });

        it('should emit inspection results for two reports', function() {
          return expect(
            subject(of(REPORT_002, REPORT_001)),
            'to complete with values',
            msg001,
            msg002
          );
        });
      });
    });

    describe('use()', function() {
      let pluginPath;

      beforeEach(function() {
        subject = core.use;
        pluginPath = require.resolve('./fixture/plugins/baz');
        core.deregisterPlugins();
      });

      it('should emit a plugin from an arbitrary path', function() {
        return expect(
          subject(require.resolve('./fixture/plugins/baz')),
          'to complete with value satisfying',
          {
            rules: expect.it('to be an array').and('not to be empty')
          }
        );
      });

      it('should register a plugin', async function() {
        await subject(pluginPath).toPromise();
        expect(core.isPluginRegistered(pluginPath), 'to be true');
      });

      it('should allow access to a registered plugin', async function() {
        await subject(pluginPath).toPromise();
        return expect(
          core.fromRegisteredRuleDefinitions(),
          'to complete with values',
          ...baz.rules
        );
      });
    });

    describe('isPluginRegistered()', function() {
      let pluginPath;
      let subject;

      beforeEach(function() {
        subject = core.isPluginRegistered;
        pluginPath = require.resolve('./fixture/plugins/baz');
        core.deregisterPlugins();
      });

      describe('when a plugin is not registered', function() {
        it('should return false', function() {
          expect(subject(pluginPath), 'to be false');
        });
      });

      describe('when a plugin is registered', function() {
        beforeEach(async function() {
          await core.use(pluginPath).toPromise();
        });
        it('should return true', function() {
          expect(subject(pluginPath), 'to be true');
        });
      });
    });

    describe('loadConfig()', function() {
      let subject;
      let cwd;

      beforeEach(function() {
        subject = core.loadConfig;
        cwd = process.cwd();
        core.deregisterPlugins();
      });

      afterEach(function() {
        process.chdir(cwd);
      });

      it('should parse a config', async function() {
        await subject({}).toPromise();
        expect(stubs['@report-toolkit/config'].parseConfig, 'was called');
      });

      it('should register plugins from cwd', async function() {
        process.chdir(__dirname);
        await subject({
          plugins: ['./fixture/plugins/baz']
        }).toPromise();
        expect(core.isPluginRegistered('./fixture/plugins/baz'), 'to be true');
      });

      it('should register default plugins', async function() {
        await subject({}).toPromise();
        expect(
          core.isPluginRegistered('@report-toolkit/inspector'),
          'to be true'
        );
      });
    });
  });
});
