// import {DEFAULT_ROOT_PATH} from './path-utils.js';

/**
 * A value and its name.
 *
 * Values often don't have an intrinsic name - their name is the key in the
 * parent object. This interface allows for a value to be associated with a
 * name.
 */
export interface TreeItem<T> {
  name?: string;
  data: T;

  /**
   * Whether the item is synthetic and not part of the original data. An example
   * is [[Entries]] on a Map or Set.
   */
  synthetic?: boolean;

  /**
   * Whether the item should be expanded by default.
   */
  expanded?: boolean;

  isNonEnumerable?: boolean;
}

export interface TreeAdapter<T> {
  expandedPaths: Map<string, boolean>;

  hasChildren(data: T): boolean;

  children(data: T): Array<TreeItem<T>> | undefined;

  /**
   * render() *must* render a slot element with role="group" to allow for
   * slot-based children to be distributed to the tree node.
   */
  render(opts: {
    item: TreeItem<T>;
    depth?: number;
    isNonEnumerable?: boolean;
    parentPath?: string;
  }): unknown;
}

// export const renderRoot = <T>(adapter: TreeAdapter<T>, data: T) => {
//   return adapter.render({
//     item: {
//       data,
//     },
//     depth: 0,
//   });
// };
