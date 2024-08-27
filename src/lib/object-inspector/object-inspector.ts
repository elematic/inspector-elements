import {
  LitElement,
  css,
  html,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {map} from 'lit/directives/map.js';
import '../object/object-name.js';
import '../object/object-value.js';
import {MapEntries, SetEntries} from '../object/object-value.js';
import {baseStyles} from '../styles/base-styles.js';
import {DEFAULT_ROOT_PATH, getExpandedPaths} from '../tree-view/path-utils.js';
import {type TreeAdapter, type TreeItem} from '../tree-view/tree-adapter.js';
import '../tree-view/tree-node.js';
import {getOwnPropertyNames} from '../utils/property-utils.js';
import './object-preview.js';

export type Comparator = (a: PropertyKey, b: PropertyKey) => number;

class ObjectTreeAdapter implements TreeAdapter<unknown> {
  #host: ObjectInspector;

  expandedPaths = new Map<string, boolean>();

  constructor(host: ObjectInspector) {
    this.#host = host;
  }

  requestUpdate() {
    return this.#host.requestUpdate();
  }

  hasChildren(data: unknown): boolean {
    if (
      (typeof data === 'object' && data !== null) ||
      typeof data === 'function'
    ) {
      if (Array.isArray(data)) {
        return data.length > 0;
      }
      if (
        typeof (data as unknown as Iterable<unknown>)[Symbol.iterator] ===
        'function'
      ) {
        return true;
      }
      const keys = getOwnPropertyNames(data) as Array<keyof typeof data>;
      return keys.length > 0;
    }
    return false;
  }

  children(data: unknown) {
    if (!this.hasChildren(data)) {
      return;
    }
    const children: Array<TreeItem<unknown>> = [];
    if (data instanceof Map) {
      children.push({
        name: '[[Entries]]',
        data: new MapEntries(data),
        synthetic: true,
        expanded: true,
      });
    } else if (data instanceof MapEntries) {
      children.push(
        ...Array.from(data.map.entries()).map(([key, value]) => ({
          name: String(key),
          data: value,
        }))
      );
      // Early return to not add object keys for MapEntries itself
      return children;
    } else if (data instanceof Set) {
      children.push({
        name: '[[Entries]]',
        data: new SetEntries(data),
        synthetic: true,
        expanded: true,
      });
    } else if (data instanceof SetEntries) {
      children.push(
        ...Array.from(data.set.values()).map((value, i) => ({
          name: String(i),
          data: value,
        }))
      );
      // Early return to not add object keys for SetEntries itself
      return children;
    } else {
      if (
        !Array.isArray(data) &&
        typeof (data as unknown as Iterable<unknown>)[Symbol.iterator] ===
          'function'
      ) {
        children.push(
          ...(Array.isArray(data)
            ? data
            : Array.from(data as Iterable<unknown>).map((value, i) => ({
                name: i.toString(),
                data: value,
              })))
        );
      }
    }
    const descriptors = Object.getOwnPropertyDescriptors(data);
    children.push(
      ...Object.entries(descriptors).map(([key, descriptor]) => ({
        name: key,
        data: (data as Record<PropertyKey, unknown>)[key],
        isNonEnumerable: !descriptor.enumerable,
      }))
    );
    return children;
  }

  render({
    item,
    depth = 0,
    isNonEnumerable,
    parentPath,
  }: {
    item: TreeItem<unknown>;
    depth?: number;
    isNonEnumerable?: boolean;
    parentPath?: string;
  }): TemplateResult {
    const path =
      parentPath === undefined
        ? DEFAULT_ROOT_PATH
        : `${parentPath}.${item.name}`;
    const expanded = this.expandedPaths.get(path) ?? item.expanded ?? false;

    const renderedName =
      typeof item.name === 'string' && item.name !== ''
        ? html`<ix-object-name
            .name=${item.name}
            .dimmed=${isNonEnumerable ?? false}
          ></ix-object-name>`
        : depth === 0
        ? undefined
        : html`<ix-object-preview .data=${item.name}></ix-object-preview>`;

    // The root level uses <ix-object-preview> to show a preview of a few
    // child properties. All other levels use <ix-object-value> to show the
    // value of the property.
    const renderedValue =
      item.data instanceof MapEntries || item.data instanceof SetEntries
        ? undefined
        : depth === 0
        ? html`<ix-object-preview .data=${item.data}></ix-object-preview>`
        : html`<ix-object-value .data=${item.data}></ix-object-value>`;

    const separator =
      renderedName && renderedValue ? html`<span>: </span>` : undefined;

    return html`<ix-tree-node
      .item=${item}
      .treeAdapter=${this}
      .expanded=${expanded}
      .showGutter=${depth > 0}
      @toggle-expanded=${() => {
        const expanded = this.expandedPaths.get(path) ?? item.expanded ?? false;
        this.expandedPaths.set(path, !expanded);
        this.#host.requestUpdate();
      }}
      ><span slot="label">${renderedName}${separator}${renderedValue}</span
      >${map(this.children(item.data), (child) =>
        this.render({
          item: child,
          depth: depth + 1,
          parentPath: path,
        })
      )}</ix-tree-node
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ix-object-inspector': ObjectInspector;
  }
}

/**
 * A tree-view for inspecting objects.
 *
 * Data is displayed in a tree structure with nodes that can be expanded or
 * collapsed.
 *
 * Data must be provided as the `data` _property_. This means that usage
 * requires JavaScript, or a template system that can set properties on
 * elements.
 *
 * Tree nodes are either expanded or collapsed. The tree is initially expanded
 * up to a depth of `expandLevel`. The tree can be expanded to a specific path
 * by providing the `expandPaths` property with a path or array of paths to
 * expand.
 *
 * A name for the root object can be provided with the `name` property.
 *
 * @cssprop --ix-base-font-family
 * @cssprop --ix-base-font-size
 * @cssprop --ix-base-line-height
 * @cssprop --ix-base-background-color
 * @cssprop --ix-base-color
 * @cssprop --ix-object-name-color
 * @cssprop --ix-object-value-null-color
 * @cssprop --ix-object-value-undefined-color
 * @cssprop --ix-object-value-regexp-color
 * @cssprop --ix-object-value-string-color
 * @cssprop --ix-object-value-symbol-color
 * @cssprop --ix-object-value-number-color
 * @cssprop --ix-object-value-boolean-color
 * @cssprop --ix-object-value-function-prefix-color
 * @cssprop --ix-html-tag-color
 * @cssprop --ix-html-tagname-color
 * @cssprop --ix-html-tagname-text-transform
 * @cssprop --ix-html-attribute-name-color
 * @cssprop --ix-html-attribute-value-color
 * @cssprop --ix-html-comment-color
 * @cssprop --ix-html-doctype-color
 * @cssprop --ix-arrow-color
 * @cssprop --ix-arrow-margin-right
 * @cssprop --ix-arrow-font-size
 * @cssprop --ix-arrow-animation-duration
 * @cssprop --ix-treenode-font-family
 * @cssprop --ix-treenode-font-size
 * @cssprop --ix-treenode-line-height
 * @cssprop --ix-treenode-padding-left
 * @cssprop --ix-table-border-color
 * @cssprop --ix-table-th-background-color
 * @cssprop --ix-table-th-hover-color
 * @cssprop --ix-table-sort-icon-color
 * @cssprop --ix-table-data-background-image
 * @cssprop --ix-table-data-background-size
 */
@customElement('ix-object-inspector')
export class ObjectInspector extends LitElement {
  static styles = [
    baseStyles,
    css`
      :host {
        display: block;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
    `,
  ];

  /**
   * An integer specifying to which level the tree should be initially expanded.
   */
  @property({type: Number})
  expandLevel = 1;

  /**
   * An array containing all the paths that should be expanded when the
   * component is initialized, or a string of just one path.
   */
  @property()
  expandPaths: string | Array<string> | undefined;

  /**
   * Optional name of the root object.
   */
  @property()
  name: string | undefined;

  /**
   * The data to inspect.
   */
  @property({type: Object})
  data: unknown;

  /**
   * Whether to show non-enumerable properties
   */
  @property({type: Boolean})
  showNonenumerable = false;

  /**
   * Sort object keys with optional compare function.
   */
  @property({attribute: false})
  sortObjectKeys: boolean | ((a: PropertyKey, b: PropertyKey) => number) =
    false;

  #treeAdapter = new ObjectTreeAdapter(this);

  protected willUpdate(changedProperties: PropertyValues): void {
    if (
      changedProperties.has('data') ||
      changedProperties.has('expandPaths') ||
      changedProperties.has('expandLevel')
    ) {
      const expandPaths = Array.isArray(this.expandPaths)
        ? this.expandPaths
        : this.expandPaths === undefined
        ? []
        : [this.expandPaths];
      this.#treeAdapter.expandedPaths = getExpandedPaths(
        this.data,
        this.#treeAdapter,
        expandPaths,
        this.expandLevel,
        this.#treeAdapter.expandedPaths
      );
      this.requestUpdate();
    }
  }

  render() {
    return this.#treeAdapter.render({
      item: {data: this.data, name: this.name},
    });
  }
}
