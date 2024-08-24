import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {type NodeData} from './dom-node-preview.js';
import '../tree-view/tree-view.js';
import {shouldInline} from './should-inline.js';
import {baseStyles} from '../styles/base-styles.js';
import type {DataIterator} from '../tree-view/path-utils.js';
import type {NodeRenderer} from '../tree-view/tree-view.js';

const domIterator: DataIterator = function* (data?: unknown) {
  const nodeData = data as NodeData;
  if (nodeData?.childNodes !== undefined) {
    const textInlined = shouldInline(nodeData);

    if (textInlined) {
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
        name: `${node.tagName}[${i}]`,
        data: node,
      };
    }

    // at least 1 child node
    if (nodeData.tagName) {
      yield {
        name: 'CLOSE_TAG',
        data: {
          tagName: nodeData.tagName,
        },
        isCloseTag: true,
      };
    }
  }
};

const nodeRenderer: NodeRenderer = ({data, expanded}) =>
  html`<ix-dom-node-preview .data=${data as NodeData} .expanded=${expanded}
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
  data: NodeData | undefined;

  render() {
    return html`<ix-tree-view
      .nodeRenderer=${nodeRenderer}
      .dataIterator=${domIterator}
      .data=${this.data}
    ></ix-tree-view>`;
  }
}
