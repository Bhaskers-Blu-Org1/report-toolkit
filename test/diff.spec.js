import {DIFF_OMIT_PATHS, diffReports} from '../src/diff-report';

const REPORT_1 = require('./fixture/reports/report-001.json');
const REPORT_2 = require('./fixture/reports/report-002-library-mismatch.json');

describe('module:diff', function() {
  describe('function', function() {
    describe('diffReport()', function() {
      it('should diff two reports using default properties', function() {
        return expect(
          diffReports(REPORT_1, REPORT_2),
          'to complete with values',
          ...require('./fixture/diff/report-001-002.json')
        );
      });

      it('should not include omitted paths', function() {
        // XXX: yes, this is incredibly slow
        this.timeout(6000);
        this.slow(2250);
        return expect(
          diffReports(REPORT_1, REPORT_2),
          'not to complete with values satisfying',
          ...Array.from(DIFF_OMIT_PATHS).map(path => ({path}))
        );
      });
    });
  });
});
