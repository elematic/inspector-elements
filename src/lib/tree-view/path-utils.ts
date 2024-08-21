export const DEFAULT_ROOT_PATH = '$';

const WILDCARD = '*';

export type DataIterator = (
  o: unknown
) => IterableIterator<{name: string; data: unknown}>;

export function hasChildNodes(
  data: unknown,
  dataIterator: DataIterator
): data is Record<PropertyKey, unknown> {
  return !dataIterator(data).next().done;
}

export const wildcardPathsFromLevel = (level: number) => {
  // i is depth
  return Array.from({length: level}, (_, i) =>
    [DEFAULT_ROOT_PATH].concat(Array.from({length: i}, () => '*')).join('.')
  );
};

export const getExpandedPaths = (
  data: Record<PropertyKey, unknown>,
  dataIterator: DataIterator,
  expandPaths: Array<string>,
  expandLevel: number = 0,
  prevExpandedPaths: Set<string> | undefined
) => {
  const wildcardPaths = [...wildcardPathsFromLevel(expandLevel)]
    .concat(expandPaths)
    .filter((path) => typeof path === 'string'); // could be undefined

  const expandedPaths = new Set<string>();
  wildcardPaths.forEach((wildcardPath) => {
    const keyPaths = wildcardPath.split('.');
    const populatePaths = (
      curData: Record<PropertyKey, unknown>,
      curPath: string,
      depth: number
    ) => {
      if (depth === keyPaths.length) {
        expandedPaths.add(curPath);
        return;
      }
      const key = keyPaths[depth];
      if (depth === 0) {
        if (
          hasChildNodes(curData, dataIterator) &&
          (key === DEFAULT_ROOT_PATH || key === WILDCARD)
        ) {
          populatePaths(curData, DEFAULT_ROOT_PATH, depth + 1);
        }
      } else {
        if (key === WILDCARD) {
          for (const {name, data} of dataIterator(curData)) {
            if (hasChildNodes(data, dataIterator)) {
              populatePaths(data, `${curPath}.${name}`, depth + 1);
            }
          }
        } else {
          const value = curData[key];
          if (hasChildNodes(value, dataIterator)) {
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
