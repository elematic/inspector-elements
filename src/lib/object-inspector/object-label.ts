import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import './object-preview.js';
import '../object/object-name.js';
import '../object/object-value.js';

/**
 * if isNonenumerable is specified, render the name dimmed
 */
@customElement('ix-object-label')
export class ObjectLabel extends LitElement {
  @property({attribute: false})
  accessor data: object | undefined;

  @property()
  accessor name: string | undefined;

  /**
   * Non enumerable object property will be dimmed
   */
  @property({type: Boolean})
  accessor isNonenumerable = false;

  render() {
    return html`<span
      >${typeof this.name === 'string'
        ? html`<ix-object-name
            .name=${this.name}
            .dimmed=${this.isNonenumerable}
          ></ix-object-name>`
        : html`<ix-object-preview .data=${this.name}></ix-object-preview>`}<span
        >: </span
      ><ix-object-value .data=${this.data}></ix-object-value
    ></span>`;
  }
}
