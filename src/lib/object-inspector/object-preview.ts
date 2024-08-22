import {LitElement, css, html} from 'lit';
import {join} from 'lit-html/directives/join.js';
import {customElement, property} from 'lit/decorators.js';
import '../object/object-name.js';
import '../object/object-value.js';
import {hasOwnProperty} from '../utils/object-prototype.js';
import {getPropertyValue} from '../utils/property-utils.js';

/**
 * A preview of the object
 */
@customElement('ix-object-preview')
export class ObjectPreview extends LitElement {
  static styles = css`
    :host {
      color: var(--ix-object-preview-color);
    }
    .objectDescription {
      color: var(--ix-object-preview-object-description-color);
    }
    .preview {
      color: var(--ix-object-preview-preview-color);
    }
  `;

  @property({attribute: false})
  data: unknown;

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
      const maxProperties = 10;
      const previewArray = object
        .slice(0, maxProperties)
        .map(
          (element) =>
            html`<ix-object-value .data=${element}></ix-object-value>`
        );

      const arrayLength = object.length;
      if (arrayLength > maxProperties) {
        previewArray.push(html`<span>…</span>`);
      }
      return html`
        <span class="objectDescription">
          ${arrayLength === 0 ? `` : `(${arrayLength})\xa0`}
        </span>
        <span class="preview"> [${join(previewArray, ', ')}] </span>
      `;
    } else {
      const maxProperties = 5; /*styles.objectMaxProperties; */
      const propertyNodes = [] as Array<unknown>;
      for (const propertyName in object) {
        if (hasOwnProperty.call(object, propertyName)) {
          let ellipsis;
          if (
            propertyNodes.length === maxProperties - 1 &&
            Object.keys(object).length > maxProperties
          ) {
            ellipsis = html`<span>…</span>`;
          }

          const propertyValue = getPropertyValue(
            object,
            propertyName as keyof typeof object
          );
          propertyNodes.push(
            html`<span key=${propertyName}>
              <ix-object-name .name=${propertyName || `""`}></ix-object-name>
              :&nbsp;
              <ix-object-value .data=${propertyValue}></ix-object-value>
              ${ellipsis}
            </span>`
          );
          if (ellipsis) break;
        }
      }

      const objectConstructorName = object.constructor
        ? object.constructor.name
        : 'Object';

      return html`
        <span class="objectDescription">
          ${objectConstructorName === 'Object'
            ? ''
            : `${objectConstructorName} `}
        </span>
        <span class="preview"> { ${join(propertyNodes, ', ')} } </span>
      `;
    }
  }
}
