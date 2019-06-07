import {createInspect} from './rules-helper';

describe('rule:long-timeout', function() {
  let inspect;

  beforeEach(function() {
    inspect = createInspect('../../src/rules/long-timeout');
  });

  describe('when the report contains an active libuv handle containing a timer beyond the default threshold', function() {
    describe('when the timer is referenced', function() {
      it('should report', function() {
        return expect(
          inspect('../fixture/reports/report-003-long-timeout.json'),
          'to complete with values',
          {
            id: 'long-timeout',
            message:
              'libuv handle at address 0x00007ffeefbfe2e8 is a timer with future expiry in 3h',
            filepath: '../fixture/reports/report-003-long-timeout.json',
            level: 'error'
          }
        );
      });
    });

    describe('when the timer is unreferenced', function() {
      it('should not report', function() {
        return expect(
          inspect('../fixture/reports/report-004-long-timeout-unref.json'),
          'not to emit values'
        );
      });
    });
  });
});
