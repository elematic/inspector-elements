/**
 * A value and its name.
 *
 * Values often don't have an intrinsic name - their name is the key in the
 * parent object. This interface allows for a value to be associated with a
 * name.
 */
export interface TreeItem<T> {
  name: string;
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
  hasChildren(data: T): boolean;

  children(data: T): Array<TreeItem<T>> | undefined;

  /**
   * render() *must* render a slot element with role="group" to allow for
   * slot-based children to be distributed to the tree node.
   */
  render(opts: {
    data: T;
    name: string | undefined;
    depth: number;
    expanded: boolean;
    isNonEnumerable?: boolean;
  }): unknown;
}
