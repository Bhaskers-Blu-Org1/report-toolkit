import cloneDeep from 'lodash/fp/cloneDeep.js';

import {REDACTED_TOKEN} from '../src/constants.js';
import {redact} from '../src/redact.js';
import {kRedacted} from '../src/symbols.js';

describe('@gnostic/common:redact', function() {
  describe('function', function() {
    describe('redact()', function() {
      describe('when provided an object with secret keys', function() {
        let obj;

        beforeEach(function() {
          obj = {
            FOO_SESSION_ID: 'aklsdjhflskfjdf',
            BOO: 'BAH',
            environmentVariables: {
              SECRET: 'kjdfgshfkdsjfh',
              API_KEY: 'kldjfghn,vcx',
              'ACCESS-KEY': 'gkasdjhfksd',
              things: ['THING_TOKEN']
            },
            PEANUT: {
              BUTTER: '&jelly'
            }
          };
        });

        it('should redact the default set of secrets', function() {
          const actual = redact(obj);
          expect(actual, 'to satisfy', {
            FOO_SESSION_ID: REDACTED_TOKEN,
            BOO: 'BAH',
            environmentVariables: {
              SECRET: REDACTED_TOKEN,
              API_KEY: REDACTED_TOKEN,
              'ACCESS-KEY': REDACTED_TOKEN,
              things: REDACTED_TOKEN
            },
            PEANUT: {
              BUTTER: '&jelly'
            },
            [kRedacted]: true
          });
        });

        describe('when option `force` is falsy', function() {
          it('should return the original object unmodified', function() {
            obj = redact(obj);
            const originalObj = cloneDeep(obj);
            const actual = redact(obj);
            expect(actual, 'to be', obj).and('to equal', originalObj);
          });
        });

        describe('when option `force` is truthy', function() {
          it('should return a new object', function() {
            obj = redact(obj);
            const originalObj = cloneDeep(obj);
            const actual = redact(obj, {force: true});
            expect(actual, 'not to be', obj).and('to equal', originalObj);
          });
        });

        describe('when option `match` is present', function() {
          describe('when option `match` is a string', function() {
            it('should redact matching key', function() {
              expect(redact(obj, {match: 'PEANUT.BUTTER'}), 'to equal', {
                FOO_SESSION_ID: REDACTED_TOKEN,
                BOO: 'BAH',
                environmentVariables: {
                  SECRET: REDACTED_TOKEN,
                  API_KEY: REDACTED_TOKEN,
                  'ACCESS-KEY': REDACTED_TOKEN,
                  things: REDACTED_TOKEN
                },
                PEANUT: {
                  BUTTER: REDACTED_TOKEN
                },
                [kRedacted]: true
              });
            });

            it('should redact matching value', function() {
              expect(redact(obj, {match: '&jelly'}), 'to equal', {
                FOO_SESSION_ID: REDACTED_TOKEN,
                BOO: 'BAH',
                environmentVariables: {
                  SECRET: REDACTED_TOKEN,
                  API_KEY: REDACTED_TOKEN,
                  'ACCESS-KEY': REDACTED_TOKEN,
                  things: REDACTED_TOKEN
                },
                PEANUT: {
                  BUTTER: REDACTED_TOKEN
                },
                [kRedacted]: true
              });
            });
          });

          describe('when option `match` is a RegExp', function() {
            it('should redact matching key', function() {
              expect(redact(obj, {match: /PEANUT\.BUTTER/}), 'to equal', {
                FOO_SESSION_ID: REDACTED_TOKEN,
                BOO: 'BAH',
                environmentVariables: {
                  SECRET: REDACTED_TOKEN,
                  API_KEY: REDACTED_TOKEN,
                  'ACCESS-KEY': REDACTED_TOKEN,
                  things: REDACTED_TOKEN
                },
                PEANUT: {
                  BUTTER: REDACTED_TOKEN
                },
                [kRedacted]: true
              });
            });

            it('should redact matching value', function() {
              expect(redact(obj, {match: /&jelly/}), 'to equal', {
                FOO_SESSION_ID: REDACTED_TOKEN,
                BOO: 'BAH',
                environmentVariables: {
                  SECRET: REDACTED_TOKEN,
                  API_KEY: REDACTED_TOKEN,
                  'ACCESS-KEY': REDACTED_TOKEN,
                  things: REDACTED_TOKEN
                },
                PEANUT: {
                  BUTTER: REDACTED_TOKEN
                },
                [kRedacted]: true
              });
            });
          });
        });
      });
    });
  });
});
