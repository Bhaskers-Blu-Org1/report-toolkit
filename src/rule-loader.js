import {basename, join, resolve} from 'path';
import {filter, map, mergeAll, mergeMap} from 'rxjs/operators';

import {Rule} from './rule';
import _ from 'lodash/fp';
import {bindNodeCallback} from 'rxjs';
import fs from 'fs';

const readdir = bindNodeCallback(fs.readdir);

const createRuleDefFromDirpath = _.curry((dirpath, entry) =>
  createRuleDefFromFilepath(resolve(dirpath, entry))
);

const createRuleDefFromFilepath = filepath => ({
  filepath,
  id: basename(filepath, '.js')
});

export const loadRuleFromRuleDef = _.memoize(async ({filepath, id}) =>
  Rule.create(
    _.assign(_.pick(['inspect', 'meta'], await import(filepath)), {
      id,
      filepath
    })
  )
);

export const loadRuleFromFilepath = _.pipe(
  createRuleDefFromFilepath,
  loadRuleFromRuleDef
);

/**
 * Loads rules in dirpath
 * @function
 * @param {string} [dirpath]
 * @returns {Observable<Object>} Exports of rule file w/ ruleId
 */
export const loadRulesFromDirpath = dirpath =>
  findRuleDefs({dirpath}).pipe(mergeMap(loadRuleFromRuleDef));

export const readDirpath = _.memoize((dirpath = join(__dirname, 'rules')) =>
  readdir(dirpath).pipe(mergeAll())
);

export const findRuleDefs = ({
  dirpath = join(__dirname, 'rules'),
  configs = {}
} = {}) => {
  const ruleDefs = readDirpath(dirpath).pipe(
    map(createRuleDefFromDirpath(dirpath))
  );
  return _.size(configs)
    ? ruleDefs.pipe(filter(({id}) => _.has(id, configs)))
    : ruleDefs;
};
