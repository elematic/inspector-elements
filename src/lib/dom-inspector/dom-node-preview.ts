import {LitElement, css, html, nothing} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {baseStyles} from '../styles/base-styles.js';
import './dom-close-tag.js';
import './dom-open-tag.js';
import {shouldInlineContent} from './should-inline.js';
import type {DomNodeData, TextData} from './types.js';

@customElement('ix-dom-node-preview')
export class DomNodePreview extends LitElement {
  static styles = [
    baseStyles,
    css`
      :host {
        display: inline-block;
        white-space: nowrap;
      }
      .htmlComment {
        color: var(--ix-html-comment-color);
      }
      .htmlDoctype {
        color: var(--ix-html-doctype-color);
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
      case Node.ELEMENT_NODE: {
        const content = this.expanded
          ? nothing
          : shouldInlineContent(data)
            ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              (data.childNodes![0] as TextData).textContent
            : '…';
        return html`<span
          >${html`<ix-dom-open-tag
            .name=${data.tagName}
            .attributeData=${data.attributes}
          ></ix-dom-open-tag>`}${content}${this.expanded
            ? nothing
            : html`<ix-dom-close-tag
                .name=${data.tagName}
              ></ix-dom-close-tag>`}</span
        >`;
      }
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
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        data as void;
        return undefined;
    }
  }
}
