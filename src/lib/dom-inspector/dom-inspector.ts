import {LitElement, css, html, nothing, type TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {map} from 'lit/directives/map.js';
import {baseStyles} from '../styles/base-styles.js';
import {DEFAULT_ROOT_PATH} from '../tree-view/path-utils.js';
import {type TreeAdapter, type TreeItem} from '../tree-view/tree-adapter.js';
import '../tree-view/tree-node.js';
import './dom-close-tag.js';
import './dom-node-preview.js';
import {shouldInlineContent} from './should-inline.js';
import {type DomNodeData, type ParentData} from './types.js';

class DOMTreeAdapter implements TreeAdapter<DomNodeData> {
  #host: DOMInspector;

  expandedPaths = new Map<string, boolean>();

  constructor(host: DOMInspector) {
    this.#host = host;
  }

  hasChildren(data: DomNodeData): boolean {
    return (
      ((data as ParentData).childNodes?.length ?? 0) > 0 &&
      !(data.nodeType === Node.ELEMENT_NODE && shouldInlineContent(data))
    );
  }

  children(data: DomNodeData): Array<TreeItem<DomNodeData>> | undefined {
    if (!this.hasChildren(data)) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (data as ParentData).childNodes!.map((node, i) => ({
      name: `${node.nodeName}[${i}]`,
      data: node,
    }));
  }

  render({
    item,
    depth = 0,
    parentPath,
  }: {
    item: TreeItem<DomNodeData>;
    depth?: number;
    isNonEnumerable?: boolean;
    parentPath?: string;
  }): TemplateResult {
    const path =
      parentPath === undefined
        ? DEFAULT_ROOT_PATH
        : `${parentPath}.${item.name}`;
    const expanded = this.expandedPaths.get(path) ?? item.expanded ?? false;

    return html`<ix-tree-node
      .item=${item}
      .treeAdapter=${this}
      .depth=${depth}
      .expanded=${expanded}
      .shouldShowPlaceholder=${depth > 0}
      @toggle-expanded=${() => {
        const expanded = this.expandedPaths.get(path) ?? item.expanded ?? false;
        this.expandedPaths.set(path, !expanded);
        this.#host.requestUpdate();
      }}
      ><ix-dom-node-preview
        slot="label"
        .data=${item.data}
        .expanded=${expanded}
      ></ix-dom-node-preview
      >${map(this.children(item.data), (child) =>
        this.render({
          item: child,
          depth: depth + 1,
          parentPath: path,
        })
      )}${item.data.nodeType === Node.ELEMENT_NODE
        ? html`<ix-dom-close-tag .name=${item.data.tagName}></ix-dom-close-tag>`
        : nothing}</ix-tree-node
    >`;
  }
}

@customElement('ix-dom-inspector')
export class DOMInspector extends LitElement {
  static styles = [
    baseStyles,
    css`
      :host {
        display: block;
      }
    `,
  ];

  @property({attribute: false})
  data: DomNodeData | undefined;

  #treeAdapter = new DOMTreeAdapter(this);

  render() {
    if (this.data === undefined) {
      return html`<span>undefined</span>`;
    }
    return this.#treeAdapter.render({
      item: {data: this.data},
    });
  }
}
