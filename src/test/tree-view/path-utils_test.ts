import {assert} from 'chai';
import {
  DEFAULT_ROOT_PATH,
  wildcardPathsFromLevel,
} from '../../lib/tree-view/path-utils.js';

const root = DEFAULT_ROOT_PATH;

suite('path-utils', () => {
  test('wildcardPathsFromLevel works', () => {
    assert.deepEqual(wildcardPathsFromLevel(-1), []);

    assert.deepEqual(wildcardPathsFromLevel(0), []);

    assert.deepEqual(wildcardPathsFromLevel(1), [root]);

    assert.deepEqual(wildcardPathsFromLevel(2), [root, `${root}.*`]);

    assert.deepEqual(wildcardPathsFromLevel(3), [
      root,
      `${root}.*`,
      `${root}.*.*`,
    ]);

    assert.deepEqual(wildcardPathsFromLevel(4), [
      root,
      `${root}.*`,
      `${root}.*.*`,
      `${root}.*.*.*`,
    ]);
  });

  // it('getExpandedPaths works', () => {
  // })
});
