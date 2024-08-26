import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {baseStyles} from '../styles/base-styles.js';
import {shouldInlineContent} from './should-inline.js';

export type DomNodeData =
  | ElementData
  | TextData
  | CDataData
  | CommentData
  | ProcessingInstructionData
  | DocumentTypeData
  | DocumentData
  | DocumentFragmentData;

export interface ParentData {
  childNodes?: DomNodeData[];
}

export type ElementData = {
  tagName: string;
  nodeType: 1;
  nodeName: string;
  attributes?: Array<AttributeData>;
  childNodes?: Array<DomNodeData>;
};

export type AttributeData = {
  name: string;
  value: string;
};

export type TextData = {
  nodeType: 3;
  nodeName: '#text';
  textContent: string;
};

export type CDataData = {
  nodeType: 4;
  nodeName: '#cdata-section';
  textContent: string;
};

export type CommentData = {
  nodeType: 8;
  nodeName: '#comment';
  textContent: string;
};

export type ProcessingInstructionData = {
  nodeType: 7;
  nodeName: '#processing-instruction';
  name: string;
};

export type DocumentData = {
  nodeType: 9;
  nodeName: '#document';
  childNodes: DomNodeData[];
};

export type DocumentTypeData = {
  nodeType: 10;
  nodeName: '#document-type';
  name: string;
  publicId?: string;
  systemId?: string;
};

export type DocumentFragmentData = {
  nodeType: 11;
  nodeName: '#document-fragment';
  childNodes: DomNodeData[];
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
  data?: DomNodeData;

  @property({type: Boolean, reflect: true})
  expanded = false;

  render() {
    const {data} = this;

    if (data === undefined) {
      return html`<span>undefined</span>`;
    }

    switch (data.nodeType) {
      case Node.ELEMENT_NODE:
        const content = shouldInlineContent(data)
          ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            (data.childNodes![0] as TextData).textContent
          : this.expanded
          ? html`<slot role="group"></slot>`
          : '…';
        return html`<span
          >${this.#renderOpenTag(data)}${content}${this.#renderCloseTag(
            data
          )}</span
        >`;
      case Node.TEXT_NODE:
        return html`<span>${data.textContent}</span>`;
      case Node.CDATA_SECTION_NODE:
        return html`<span>${'<![CDATA[' + data.textContent + ']]>'}</span>`;
      case Node.PROCESSING_INSTRUCTION_NODE:
        return html`<span>${data.nodeName}</span>`;
      case Node.COMMENT_NODE:
        return html`<span class="htmlComment"
          >&lt;!--${data.textContent}--&gt;</span
        >`;
      case Node.DOCUMENT_NODE:
        return html`<span>${data.nodeName}</span>`;
      case Node.DOCUMENT_TYPE_NODE:
        return html`<span class="htmlDoctype">
          &lt;!DOCTYPE ${data.name}
          ${data.publicId ? ` PUBLIC "${data.publicId}"` : ''}
          ${!data.publicId && data.systemId ? ' SYSTEM' : ''}
          ${data.systemId ? ` "${data.systemId}"` : ''} &gt;
        </span>`;
      case Node.DOCUMENT_FRAGMENT_NODE:
        return html`<span>${data.nodeName}</span>`;
      default:
        data as void;
        return undefined;
    }
  }

  #renderOpenTag(data: ElementData) {
    const {tagName, attributes} = data;
    return html`<span
      >&lt;<span class="tagName">${tagName}</span>${attributes?.map(
        (attribute) =>
          html`<span>
            <span class="htmlAttributeName">${attribute.name}</span>="<span
              class="htmlAttributeValue"
              >${attribute.value}</span
            >"</span
          >`
      )}&gt;</span
    >`;
  }

  #renderCloseTag(data: ElementData) {
    console.log('#renderCloseTag');
    return html`<span
      >&lt;/<span class="tagName">${data.tagName}</span>&gt;</span
    >`;
  }
}
