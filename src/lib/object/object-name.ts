import {LitElement, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

/**
 * A view for object property names.
 *
 * If the property name is enumerable (in Object.keys(object)),
 * the property name will be rendered normally.
 *
 * If the property name is not enumerable (`Object.prototype.propertyIsEnumerable()`),
 * the property name will be dimmed to show the difference.
 */
@customElement('ix-object-name')
export class ObjectName extends LitElement{
  static styles = css`
    :host {
      color: var(--ix-object-name-color);
    }
    :host([dimmed]) {
      opacity: var(--ix-object-name-dimmed-opacity, 0.6);
    }
  `;

  @property({reflect: true})
  accessor name: string | undefined;

  @property({type: Boolean, reflect: true})
  accessor dimmed = false;

  render() {
    return this.name;
  }
};
