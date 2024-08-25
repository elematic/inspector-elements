import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {baseStyles} from '../styles/base-styles.js';
import type {DataIterator} from '../tree-view/path-utils.js';
import '../tree-view/tree-view.js';
import type {NodeRenderer} from '../tree-view/tree-view.js';
import {type DomNodeData} from './dom-node-preview.js';
import {shouldInlineContent} from './should-inline.js';

const domIterator: DataIterator = function* (data?: unknown) {
  const nodeData = data as DomNodeData;
  if (
    nodeData.nodeType === Node.ELEMENT_NODE &&
    nodeData.childNodes !== undefined
  ) {
    if (shouldInlineContent(nodeData)) {
      return;
    }

    for (let i = 0; i < nodeData.childNodes.length; i++) {
      const node = nodeData.childNodes[i];

      if (
        node.nodeType === Node.TEXT_NODE &&
        node.textContent?.trim().length === 0
      ) {
        continue;
      }

      yield {
        name: `${node.nodeName}[${i}]`,
        data: node,
      };
    }
  }
};

const nodeRenderer: NodeRenderer = ({data, expanded}) =>
  html`<ix-dom-node-preview .data=${data as DomNodeData} .expanded=${expanded}
    ><slot role="group"></slot
  ></ix-dom-node-preview>`;

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
      .nodeRenderer=${nodeRenderer}
      .dataIterator=${domIterator}
      .data=${this.data}
    ></ix-tree-view>`;
  }
}
