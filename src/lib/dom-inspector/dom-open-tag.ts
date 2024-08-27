import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import type {AttributeData} from './types.js';

@customElement('ix-dom-open-tag')
export class DomOpenTag extends LitElement {
  static styles = css`
    :host {
      white-space: nowrap;
      color: var(--ix-html-tag-color);
    }

    .tagName {
      color: var(--ix-html-tagname-color);
      text-transform: var(--ix-html-tagname-text-transform);
    }

    .htmlAttributeName {
      color: var(--ix-html-attribute-name-color);
    }

    .htmlAttributeValue {
      color: var(--ix-html-attribute-value-color);
    }
  `;

  @property()
  name?: string;

  @property({attribute: false})
  attributeData: Array<AttributeData> | undefined;

  @property({type: Boolean, reflect: true})
  expanded = false;

  render() {
    return html`<span
      >&lt;<span class="tagName">${this.name}</span>${this.attributeData?.map(
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
}
