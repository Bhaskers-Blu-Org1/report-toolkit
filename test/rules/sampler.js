import {
  concatMap,
  fromEvent,
  iif,
  interval,
  map,
  of,
  pluck,
  takeWhile
} from '../../src/observable';

const emitReport = () => {
  const report = process.report.getReport();
  process.send({title: 'report', report});
};

fromEvent(process, 'message')
  .pipe(
    pluck(0),
    concatMap(({title = '', payload = {}} = {}) =>
      iif(
        () => title === 'start',
        interval(payload.interval).pipe(map(count => count < payload.count)),
        of(false)
      )
    ),
    takeWhile(Boolean)
  )
  .subscribe(emitReport);

process.send({title: 'ready'});
