import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {baseStyles} from '../styles/base-styles.js';
import '../tree-view/tree-view.js';
import {type DomNodeData, type ParentData} from './dom-node-preview.js';
import type {TreeAdapter, TreeItem} from '../tree-view/tree-adapter.js';

const domTreeAdapter: TreeAdapter<DomNodeData> = {
  hasChildren(data: DomNodeData): boolean {
    return ((data as ParentData).childNodes?.length ?? 0) > 0;
  },

  children(data: DomNodeData): Array<TreeItem<DomNodeData>> | undefined {
    if (!this.hasChildren(data)) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (data as ParentData).childNodes!.map((node, i) => ({
      name: `${node.nodeName}[${i}]`,
      data: node,
    }));
  },

  render({
    data,
    expanded,
  }: {
    data: DomNodeData;
    name: string | undefined;
    depth: number;
    expanded: boolean;
    isNonEnumerable?: boolean;
  }) {
    return html`<ix-dom-node-preview .data=${data} .expanded=${expanded}
      ><slot role="group"></slot
    ></ix-dom-node-preview>`;
  },
};

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

  render() {
    return html`<ix-tree-view
      .treeAdapter=${domTreeAdapter}
      .data=${this.data}
    ></ix-tree-view>`;
  }
}
