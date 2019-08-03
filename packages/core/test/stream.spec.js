import {ERROR} from '@report-toolkit/common/src/constants.js';
import {of} from '@report-toolkit/common/src/observable.js';
// @ts-ignore
import REPORT_001 from '@report-toolkit/common/test/fixture/reports/report-001.json';
// @ts-ignore
import REPORT_002 from '@report-toolkit/common/test/fixture/reports/report-002-library-mismatch.json';

const REPORT_001_FILEPATH = require.resolve(
  '@report-toolkit/common/test/fixture/reports/report-001.json'
);
const REPORT_002_FILEPATH = require.resolve(
  '@report-toolkit/common/test/fixture/reports/report-002-library-mismatch.json'
);

describe('@report-toolkit/core:stream', function() {
  let sandbox;
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

  beforeEach(function() {
    sandbox = sinon.createSandbox();

    subject = proxyquire(require.resolve('../src/stream'), {
      '@report-toolkit/inspector': {
        inspectReports: sandbox
          .stub()
          .returns(sandbox.stub().returnsObservableOf(msg001, msg002))
      }
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('function', function() {
    describe('toReportDiff()', function() {
      let toReportDiff;

      beforeEach(function() {
        toReportDiff = subject.toReportDiff;
        sandbox.spy(subject, 'reportFromObject');
      });

      it('should diff two reports by default properties', function() {
        return expect(
          of(REPORT_001, REPORT_002).pipe(toReportDiff()),
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
          },
          {
            oldValue: 'node',
            op: 'replace',
            path: '/header/commandLine/0',
            value: './node'
          },
          {oldValue: '-e', op: 'remove', path: '/header/commandLine/2'},
          {
            oldValue: 'process.report.writeReport()',
            op: 'remove',
            path: '/header/commandLine/3'
          },
          {
            oldValue: 'v12.1.0',
            op: 'replace',
            path: '/header/nodejsVersion',
            value: 'v12.0.0-pre'
          },
          {
            oldValue: '12.1.0',
            op: 'replace',
            path: '/header/componentVersions/node',
            value: '12.0.0-pre'
          },
          {
            oldValue: '7.4.288.21-node.16',
            op: 'replace',
            path: '/header/componentVersions/v8',
            value: '7.4.288.13-node.16'
          },
          {
            oldValue: '1.28.0',
            op: 'replace',
            path: '/header/componentVersions/uv',
            value: '1.27.0'
          },
          {
            oldValue: '1.38.0',
            op: 'replace',
            path: '/header/componentVersions/nghttp2',
            value: '1.37.0'
          },
          {
            oldValue: '35.1',
            op: 'replace',
            path: '/header/componentVersions/cldr',
            value: '34.0'
          },
          {
            oldValue: '64.2',
            op: 'replace',
            path: '/header/componentVersions/icu',
            value: '63.1'
          },
          {
            oldValue: '2019a',
            op: 'replace',
            path: '/header/componentVersions/tz',
            value: '2018e'
          },
          {
            oldValue: '12.1',
            op: 'replace',
            path: '/header/componentVersions/unicode',
            value: '11.0'
          },
          {
            oldValue:
              'https://nodejs.org/download/release/v12.1.0/node-v12.1.0-headers.tar.gz',
            op: 'remove',
            path: '/header/release/headersUrl'
          },
          {
            oldValue:
              'https://nodejs.org/download/release/v12.1.0/node-v12.1.0.tar.gz',
            op: 'remove',
            path: '/header/release/sourceUrl'
          },
          {
            oldValue: 'changes,header',
            op: 'remove',
            path: '/environmentVariables/BAT_STYLE'
          },
          {
            oldValue: '/Users/boneskull/.nvm/versions/node/v12.1.0/bin',
            op: 'remove',
            path: '/environmentVariables/NVM_BIN'
          },
          {
            op: 'add',
            path: '/environmentVariables/COMMAND_MODE',
            value: 'unix2003'
          },
          {
            oldValue:
              '/Users/boneskull/projects/christopher-hiller/report-toolkit',
            op: 'replace',
            path: '/environmentVariables/PWD',
            value: '/Users/boneskull/projects/nodejs/node'
          },
          {
            oldValue:
              '/Users/boneskull/.nvm/versions/node/v12.1.0/bin:/usr/local/opt/ruby/bin:/usr/local/opt/ccache/libexec:/opt/X11/bin:./node_modules/.bin:/Users/boneskull/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/sbin:/usr/local/MacGPG2/bin:/usr/local/share/dotnet:/Library/Frameworks/Mono.framework/Versions/Current/Commands:/Applications/Wireshark.app/Contents/MacOS:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/lib:/Users/boneskull/.antigen/bundles/zsh-users/zsh-syntax-highlighting:/Users/boneskull/.antigen/bundles/zsh-users/zsh-history-substring-search:/Users/boneskull/.antigen/bundles/zsh-users/zsh-completions:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/git:/Users/boneskull/.antigen/bundles/smallhadroncollider/antigen-git-rebase:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/git-extras:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/gitignore:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/github:/Users/boneskull/.antigen/bundles/denolfe/zsh-travis:/Users/boneskull/.antigen/bundles/mollifier/cd-gitroot:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/node:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/nvm:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/npm:/Users/boneskull/.antigen/bundles/tomsquest/nvm-auto-use.zsh:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/pip:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/python:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/vagrant:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/history:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/bundler:/Users/boneskull/.antigen/bundles/Tarrasch/zsh-mcd:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/osx:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/brew',
            op: 'replace',
            path: '/environmentVariables/PATH',
            value:
              '/usr/local/opt/ruby/bin:/usr/local/opt/ccache/libexec:/opt/X11/bin:./node_modules/.bin:/Users/boneskull/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/sbin:/usr/local/MacGPG2/bin:/usr/local/share/dotnet:/Library/Frameworks/Mono.framework/Versions/Current/Commands:/Applications/Wireshark.app/Contents/MacOS:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/lib:/Users/boneskull/.antigen/bundles/zsh-users/zsh-syntax-highlighting:/Users/boneskull/.antigen/bundles/zsh-users/zsh-history-substring-search:/Users/boneskull/.antigen/bundles/zsh-users/zsh-completions:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/git:/Users/boneskull/.antigen/bundles/smallhadroncollider/antigen-git-rebase:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/git-extras:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/gitignore:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/github:/Users/boneskull/.antigen/bundles/denolfe/zsh-travis:/Users/boneskull/.antigen/bundles/mollifier/cd-gitroot:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/node:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/nvm:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/npm:/Users/boneskull/.antigen/bundles/tomsquest/nvm-auto-use.zsh:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/pip:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/python:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/vagrant:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/history:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/bundler:/Users/boneskull/.antigen/bundles/Tarrasch/zsh-mcd:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/osx:/Users/boneskull/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/brew'
          },
          {
            oldValue:
              '/Users/boneskull/projects/christopher-hiller/report-toolkit/test',
            op: 'replace',
            path: '/environmentVariables/OLDPWD',
            value: '/usr/local/opt/openssl'
          },
          {
            oldValue: '/Users/boneskull/.nvm/versions/node/v12.1.0/bin/node',
            op: 'replace',
            path: '/environmentVariables/_',
            value: '/Users/boneskull/projects/nodejs/node/./node'
          },
          {
            oldValue: '/Users/boneskull/.nvm/versions/node/v12.1.0/bin/node',
            op: 'replace',
            path: '/sharedObjects/0',
            value: '/Users/boneskull/projects/nodejs/node/./node'
          },
          {
            op: 'add',
            path: '/sharedObjects/1',
            value: '/usr/local/opt/openssl@1.1/lib/libcrypto.1.1.dylib'
          },
          {
            op: 'add',
            path: '/sharedObjects/2',
            value: '/usr/local/opt/openssl@1.1/lib/libssl.1.1.dylib'
          },
          {
            oldValue: '/usr/lib/libicucore.A.dylib',
            op: 'remove',
            path: '/sharedObjects/6'
          },
          {
            oldValue: '/usr/lib/libz.1.dylib',
            op: 'remove',
            path: '/sharedObjects/7'
          },
          {
            oldValue: '/usr/lib/libc++abi.dylib',
            op: 'remove',
            path: '/sharedObjects/8'
          },
          {
            oldValue: '/usr/lib/system/libcache.dylib',
            op: 'remove',
            path: '/sharedObjects/9'
          },
          {
            oldValue: '/usr/lib/system/libcommonCrypto.dylib',
            op: 'remove',
            path: '/sharedObjects/10'
          },
          {
            op: 'add',
            path: '/sharedObjects/39',
            value: '/usr/lib/libobjc.A.dylib'
          },
          {
            op: 'add',
            path: '/sharedObjects/40',
            value: '/usr/lib/libc++abi.dylib'
          },
          {
            op: 'add',
            path: '/sharedObjects/41',
            value: '/usr/lib/libdiagnosticMessagesClient.dylib'
          },
          {
            op: 'add',
            path: '/sharedObjects/42',
            value: '/usr/lib/libicucore.A.dylib'
          },
          {
            op: 'add',
            path: '/sharedObjects/43',
            value: '/usr/lib/libz.1.dylib'
          }
        );
      });

      it('should ignore three or more reports');
    });
  });
});
