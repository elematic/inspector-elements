import type {TreeAdapter} from './tree-adapter.js';

export const DEFAULT_ROOT_PATH = '$';

const WILDCARD = '*';

// export function hasChildNodes(
//   data: unknown,
//   dataIterator: DataIterator
// ): data is Record<PropertyKey, unknown> {
//   return !dataIterator(data).next().done;
// }

export const wildcardPathsFromLevel = (level: number) => {
  // i is depth
  return Array.from({length: level}, (_, i) =>
    [DEFAULT_ROOT_PATH].concat(Array.from({length: i}, () => '*')).join('.')
  );
};

export const getExpandedPaths = (
  data: unknown,
  treeAdapter: TreeAdapter<unknown>,
  expandPaths: Array<string>,
  expandLevel = 0,
  prevExpandedPaths: Set<string> | undefined
) => {
  const wildcardPaths = [...wildcardPathsFromLevel(expandLevel)]
    .concat(expandPaths)
    .filter((path) => typeof path === 'string'); // could be undefined

  const expandedPaths = new Set<string>();
  wildcardPaths.forEach((wildcardPath) => {
    const keyPaths = wildcardPath.split('.');
    const populatePaths = (
      curData: unknown,
      curPath: string,
      depth: number
    ) => {
      if (depth === keyPaths.length) {
        expandedPaths.add(curPath);
        return;
      }
      const key = keyPaths[depth];
      const hasChildren = treeAdapter.hasChildren(curData);
      if (depth === 0) {
        if (hasChildren && (key === DEFAULT_ROOT_PATH || key === WILDCARD)) {
          populatePaths(curData, DEFAULT_ROOT_PATH, depth + 1);
        }
      } else {
        if (key === WILDCARD) {
          for (const {data, name} of treeAdapter.children(curData) ?? []) {
            if (hasChildren) {
              populatePaths(data, `${curPath}.${name}`, depth + 1);
            }
          }
        } else if (curData != null) {
          const value = (curData as Record<string, unknown>)[key];
          if (hasChildren) {
            populatePaths(value, `${curPath}.${key}`, depth + 1);
          }
        }
      }
    };

    populatePaths(data, '', 0);
  });

  if (prevExpandedPaths !== undefined) {
    for (const path of prevExpandedPaths) {
      expandedPaths.add(path);
    }
  }

  return expandedPaths;
};
