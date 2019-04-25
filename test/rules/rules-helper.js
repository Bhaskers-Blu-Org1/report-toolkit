import {map, mergeMap} from 'rxjs/operators';

import {Inspector} from '../../src/inspector';
import {Report} from '../../src/report';
import {loadRuleFromFilepath} from '../../src/rule-loader';
import {readReport} from '../../src/report-reader';

export const createInspect = async (ruleFilepath, config = {}) => {
  const inspector = Inspector.create(
    await loadRuleFromFilepath(require.resolve(ruleFilepath)),
    config
  );
  return filepath =>
    readReport(require.resolve(filepath)).pipe(
      map(report => Report.create(report, filepath)),
      mergeMap(report => inspector.inspect(report))
    );
};
