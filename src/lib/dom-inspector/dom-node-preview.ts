import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {shouldInline} from './should-inline.js';
import {baseStyles} from '../styles/base-styles.js';

export interface NodeData {
  tagName: string;
  nodeType: keyof typeof nameByNodeType;
  nodeName: string;
  name?: string;
  attributes: any[];
  textContent?: string;
  publicId?: string;
  systemId?: string;
  childNodes?: NodeData[];
}

const nameByNodeType = {
  1: 'ELEMENT_NODE',
  3: 'TEXT_NODE',
  4: 'CDATA_SECTION_NODE',
  7: 'PROCESSING_INSTRUCTION_NODE',
  8: 'COMMENT_NODE',
  9: 'DOCUMENT_NODE',
  10: 'DOCUMENT_TYPE_NODE', // http://stackoverflow.com/questions/6088972/get-doctype-of-an-html-as-string-with-javascript
  11: 'DOCUMENT_FRAGMENT_NODE',
};

@customElement('ix-dom-node-preview')
export class DomNodePreview extends LitElement {
  static styles = [
    baseStyles,
    css`
      :host {
        display: inline-block;
        white-space: nowrap;
      }
    `,
  ];

  @property({attribute: false})
  data?: NodeData;

  @property({type: Boolean, reflect: true})
  expanded = false;

  render() {
    console.log('render', this.expanded);
    const {data} = this;

    if (data === undefined) {
      return html`<span>undefined</span>`;
    }

    switch (data.nodeType) {
      case Node.ELEMENT_NODE:
        return html`<span
          >${this.#renderOpenTag(data)}${shouldInline(data)
            ? data.textContent
            : this.expanded
            ? html`<slot role="group"></slot>`
            : '…'}${this.#renderCloseTag(data)}</span
        >`;
      case Node.TEXT_NODE:
        return html`<span>${data.textContent}</span>`;
      case Node.CDATA_SECTION_NODE:
        return html`<span>${'<![CDATA[' + data.textContent + ']]>'}</span>`;
      case Node.COMMENT_NODE:
        return html`<span class="htmlComment"
          >&lt;!--${data.textContent}--&gt;</span
        >`;
      case Node.PROCESSING_INSTRUCTION_NODE:
        return html`<span>${data.nodeName}</span>`;
      case Node.DOCUMENT_TYPE_NODE:
        return html`<span class="htmlDoctype">
          &lt;!DOCTYPE ${data.name}
          ${data.publicId ? ` PUBLIC "${data.publicId}"` : ''}
          ${!data.publicId && data.systemId ? ' SYSTEM' : ''}
          ${data.systemId ? ` "${data.systemId}"` : ''} &gt;
        </span>`;
      case Node.DOCUMENT_NODE:
        return html`<span>${data.nodeName}</span>`;
      case Node.DOCUMENT_FRAGMENT_NODE:
        return html`<span>${data.nodeName}</span>`;
      default:
        return html`<span>${nameByNodeType[data.nodeType]}</span>`;
    }
  }

  #renderOpenTag(data: NodeData) {
    const {tagName, attributes} = data;
    return html`<span
      >&lt;<span class="tagName">${tagName}</span>${attributes?.map(
        (attribute) =>
          html`<span>
            <span class="htmlAttributeName">${attribute.name}</span>="
            <span class="htmlAttributeValue">${attribute.value}</span>"</span
          >`
      )}&gt;</span
    >`;
  }

  #renderCloseTag(data: NodeData) {
    console.log('#renderCloseTag');
    return html`<span
      >&lt;/<span class="tagName">${data.tagName}</span>&gt;</span
    >`;
  }
}
