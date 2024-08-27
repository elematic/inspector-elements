import {LitElement, css, html} from 'lit';
import {join} from 'lit-html/directives/join.js';
import {customElement, property} from 'lit/decorators.js';
import '../object/object-name.js';
import '../object/object-value.js';
import {
  getOwnPropertyNames,
  safeGetPropertyValue,
} from '../utils/property-utils.js';

/**
 * A compact (1-line-ish) preview of an object. Includes a small number of
 * properties and their values.
 *
 * The number of properties shown is limited by the `maxProperties` property.
 */
@customElement('ix-object-preview')
export class ObjectPreview extends LitElement {
  static styles = css`
    :host {
      color: var(--ix-object-preview-color);
      font-style: var(--ix-object-preview-font-style);
    }
  `;

  @property({attribute: false})
  data: unknown;

  @property({type: Number})
  maxProperties = 5;

  @property({type: Number})
  maxArrayItems = 10;

  render() {
    const object = this.data;

    if (
      typeof object !== 'object' ||
      object === null ||
      object instanceof Date ||
      object instanceof RegExp
    ) {
      return html`<ix-object-value .data=${object}></ix-object-value>`;
    }

    if (Array.isArray(object)) {
      const previewArray = object
        .slice(0, this.maxArrayItems)
        .map(
          (element) =>
            html`<ix-object-value .data=${element}></ix-object-value>`
        );

      const arrayLength = object.length;
      if (arrayLength > this.maxArrayItems) {
        previewArray.push(html`<span>…</span>`);
      }
      return html`
        <span>${arrayLength === 0 ? `` : `(${arrayLength})\xa0`}</span
        ><span>[${join(previewArray, ', ')}]</span>
      `;
    } else {
      const propertyNames = getOwnPropertyNames(object);
      const propertyNodes = propertyNames
        .slice(0, this.maxProperties)
        .map((propertyName) => {
          const propertyValue = safeGetPropertyValue(
            object,
            propertyName as keyof typeof object
          );
          return html`<span
            ><ix-object-name .name=${propertyName || `""`}></ix-object-name
            >:&nbsp;<ix-object-value .data=${propertyValue}></ix-object-value
          ></span>`;
        });
      if (propertyNames.length > this.maxProperties) {
        propertyNodes.push(html`<span>…</span>`);
      }

      const constructorName =
        object.constructor === undefined || object.constructor.name === 'Object'
          ? undefined
          : `${object.constructor.name} `;

      return html`
        <span>${constructorName}</span
        ><span>{${join(propertyNodes, ', ')}}</span>
      `;
    }
  }
}
