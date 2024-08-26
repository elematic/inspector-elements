import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

export class MapEntries {
  map: Map<unknown, unknown>;
  constructor(map: Map<unknown, unknown>) {
    this.map = map;
  }
}

export class SetEntries {
  set: Set<unknown>;
  constructor(set: Set<unknown>) {
    this.set = set;
  }
}

/**
 * A short description of the object values.
 * Can be used to render tree node in ObjectInspector
 * or render objects in TableInspector.
 */
@customElement('ix-object-value')
export class ObjectValue extends LitElement {
  static styles = css`
    :host {
      color: var(--ix-object-value-color);
    }
    .number {
      color: var(--ix-object-value-number-color);
    }
    .string {
      color: var(--ix-object-value-string-color);
    }
    .boolean {
      color: var(--ix-object-value-boolean-color);
    }
    .undefined {
      color: var(--ix-object-value-undefined-color);
    }
    .null {
      color: var(--ix-object-value-null-color);
    }
    .RegExp {
      color: var(--ix-object-value-regexp-color);
    }
    .FunctionPrefix {
      color: var(--ix-object-value-function-prefix-color);
      font-style: 'italic';
    }
    .FunctionName {
      color: var(--ix-object-value-function-name-color);
      font-style: 'italic';
    }
    .symbol {
      color: var(--ix-object-value-symbol-color);
    }
  `;

  @property({attribute: false})
  data: unknown;

  render() {
    const object = this.data;

    switch (typeof object) {
      case 'bigint':
        return html`<span class="number">${String(object)}n</span>`;
      case 'number':
        return html`<span class="number">${String(object)}</span>`;
      case 'string':
        return html`<span class="string">"${object}"</span>`;
      case 'boolean':
        return html`<span class="boolean">${String(object)}</span>`;
      case 'undefined':
        return html`<span class="undefined">undefined</span>`;
      case 'object':
        if (object === null) {
          return html`<span class="null">null</span>`;
        }
        if (object instanceof Map) {
          return html`<span>Map(${object.size})</span>`;
        }
        if (object instanceof Set) {
          return html`<span>Set(${object.size})</span>`;
        }
        if (object instanceof MapEntries) {
          return html`<span>(${object.map.size})</span>`;
        }
        if (object instanceof SetEntries) {
          return html`<span>(${object.set.size})</span>`;
        }
        if (object instanceof Date) {
          return html`<span>${object.toString()}</span>`;
        }
        if (object instanceof RegExp) {
          return html`<span class="RegExp"> ${object.toString()} </span>`;
        }
        if (Array.isArray(object)) {
          return html`<span>${`Array(${object.length})`}</span>`;
        }
        if (!object.constructor) {
          return html`<span>Object</span>`;
        }
        if (
          typeof (object as Buffer).constructor.isBuffer === 'function' &&
          (object as Buffer).constructor.isBuffer(object)
        ) {
          return html`<span>${`Buffer[${(object as Buffer).length}]`}</span>`;
        }

        return html`<span>${object.constructor.name}</span>`;
      case 'function':
        return html`<span>
          <span class="FunctionPrefix">ƒ&nbsp;</span>
          <span class="FunctionName"> ${object.name}() </span>
        </span>`;
      case 'symbol':
        return html`<span class="symbol">${object.toString()}</span>`;
      default:
        return html`<span></span>`;
    }
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
interface BufferConstructor extends Function {
  isBuffer: (object: unknown) => boolean;
}

interface Buffer extends Uint8Array {
  constructor: BufferConstructor;
}
