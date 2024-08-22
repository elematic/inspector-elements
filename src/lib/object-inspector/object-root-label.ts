import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '../object/object-name.js';
import './object-preview.js';

@customElement('ix-object-root-label')
export class ObjectRootLabel extends LitElement {
  @property()
  name: string | undefined;

  @property({attribute: false})
  data: unknown;

  render() {
    if (typeof this.name === 'string') {
      return html`<span
        ><ix-object-name .name=${this.name}></ix-object-name><span>: </span
        ><ix-object-preview .data=${this.data}></ix-object-preview
      ></span>`;
    } else {
      return html`<ix-object-preview .data=${this.data}></ix-object-preview>`;
    }
  }
}
