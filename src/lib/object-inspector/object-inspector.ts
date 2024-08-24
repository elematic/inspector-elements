import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '../tree-view/tree-view.js';
import {type NodeRenderer} from '../tree-view/tree-view.js';
import {propertyIsEnumerable} from '../utils/object-prototype.js';
import {getPropertyValue} from '../utils/property-utils.js';
import './object-label.js';
import './object-root-label.js';

export type Comparator = (a: PropertyKey, b: PropertyKey) => number;

const createIterator = (
  showNonenumerable: boolean,
  sortObjectKeys: Comparator | boolean
) => {
  const objectIterator = function* <T extends Iterable<unknown>>(data: T) {
    const shouldIterate =
      (typeof data === 'object' && data !== null) || typeof data === 'function';
    if (!shouldIterate) return;

    const dataIsArray = Array.isArray(data);

    // iterable objects (except arrays)
    if (!dataIsArray && data[Symbol.iterator]) {
      let i = 0;
      for (const entry of data) {
        if (Array.isArray(entry) && entry.length === 2) {
          const [k, v] = entry;
          yield {
            name: k,
            data: v,
          };
        } else {
          yield {
            name: i.toString(),
            data: entry,
          };
        }
        i++;
      }
    } else {
      const keys = Object.getOwnPropertyNames(data) as Array<keyof T>;
      if (sortObjectKeys === true && !dataIsArray) {
        // Array keys should not be sorted in alphabetical order
        keys.sort();
      } else if (typeof sortObjectKeys === 'function') {
        keys.sort(sortObjectKeys);
      }

      for (const propertyName of keys) {
        if (propertyIsEnumerable.call(data, propertyName)) {
          const propertyValue = getPropertyValue(data, propertyName);
          yield {
            name: propertyName || `""`,
            data: propertyValue,
          };
        } else if (showNonenumerable) {
          // To work around the error (happens some time when propertyName ===
          // 'caller' || propertyName === 'arguments') 'caller' and 'arguments'
          // are restricted function properties and cannot be accessed in this
          // context
          // http://stackoverflow.com/questions/31921189/caller-and-arguments-are-restricted-function-properties-and-cannot-be-access
          let propertyValue;
          try {
            propertyValue = getPropertyValue(data, propertyName);
          } catch (e) {
            // console.warn(e)
          }

          if (propertyValue !== undefined) {
            yield {
              name: propertyName,
              data: propertyValue,
              isNonenumerable: true,
            };
          }
        }
      }

      // [[Prototype]] of the object: `Object.getPrototypeOf(data)`
      // the property name is shown as "__proto__"
      if (showNonenumerable && data !== Object.prototype /* already added */) {
        yield {
          name: '__proto__',
          data: Object.getPrototypeOf(data),
          isNonenumerable: true,
        };
      }
    }
  };

  return objectIterator;
};

const defaultNodeRenderer: NodeRenderer = ({
  depth,
  name,
  data,
  isNonenumerable,
}) =>
  depth === 0
    ? html`<ix-object-root-label
          .name=${name}
          .data=${data}
        ></ix-object-root-label
        ><slot role="group"></slot>`
    : html`<ix-object-label
          .name=${name}
          .data=${data}
          .isNonenumerable=${isNonenumerable ?? false}
        ></ix-object-label
        ><slot role="group"></slot>`;

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
  static styles = css`
    :host {
      display: block;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
  `;

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

  /**
   * Provide a custom nodeRenderer
   */
  @property()
  nodeRenderer: NodeRenderer | undefined;

  render() {
    const dataIterator = createIterator(
      this.showNonenumerable,
      this.sortObjectKeys
    );
    const renderer = this.nodeRenderer ?? defaultNodeRenderer;

    return html`<ix-tree-view
      .name=${this.name}
      .data=${this.data}
      .nodeRenderer=${renderer}
      .dataIterator=${dataIterator}
      .expandPaths=${this.expandPaths}
      .expandLevel=${this.expandLevel}
    ></ix-tree-view>`;
  }
}
