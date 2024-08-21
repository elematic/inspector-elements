import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '../tree-view/tree-view.js';
import './object-root-label.js';
import './object-label.js';
import {propertyIsEnumerable} from '../utils/object-prototype.js';
import {getPropertyValue} from '../utils/property-utils.js';
import {type NodeRenderer} from '../tree-view/tree-view.js';

const createIterator = (showNonenumerable: any, sortObjectKeys: any) => {
  const objectIterator = function* (data: any) {
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
      const keys = Object.getOwnPropertyNames(data);
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
          // To work around the error (happens some time when propertyName === 'caller' || propertyName === 'arguments')
          // 'caller' and 'arguments' are restricted function properties and cannot be accessed in this context
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
}: any) =>
  depth === 0
    ? html`<ix-object-root-label
        .name=${name}
        .data=${data}
      ></ix-object-root-label>`
    : html`<ix-object-label
        .name=${name}
        .data=${data}
        .isNonenumerable=${isNonenumerable}
      ></ix-object-label>`;

declare global {
  interface HTMLElementTagNameMap {
    'ix-object-inspector': ObjectInspector;
  }
}

/**
 * Tree-view for objects
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
  accessor expandLevel: number = 1;

  /**
   * An array containing all the paths that should be expanded when the
   * component is initialized, or a string of just one path.
   */
  @property()
  accessor expandPaths: string | Array<string> | undefined;

  @property()
  accessor name: string | undefined;

  /**
   * The data to inspect.
   */
  @property({type: Object})
  accessor data: unknown;

  /**
   * Whether to show non-enumerable properties
   */
  @property({type: Boolean})
  accessor showNonenumerable = false;

  /**
   * Sort object keys with optional compare function.
   */
  @property({attribute: false})
  accessor sortObjectKeys:
    | boolean
    | ((a: PropertyKey, b: PropertyKey) => number) = false;

  /**
   * Provide a custom nodeRenderer
   */
  @property()
  accessor nodeRenderer: NodeRenderer | undefined;

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
