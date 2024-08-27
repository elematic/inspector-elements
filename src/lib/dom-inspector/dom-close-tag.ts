import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('ix-dom-close-tag')
export class DomCloseTag extends LitElement {
  static styles = css`
    :host {
      white-space: nowrap;
      color: var(--ix-html-tag-color);
    }

    .tagName {
      color: var(--ix-html-tagname-color);
      text-transform: var(--ix-html-tagname-text-transform);
    }
  `;

  @property({attribute: false})
  name?: string;

  @property({type: Boolean, reflect: true})
  expanded = false;

  render() {
    return html`&lt;/<span class="tagName">${this.name}</span>&gt;`;
  }
}
