import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {baseStyles} from '../styles/base-styles.js';
import {SlotController} from '../utils/slot-controller.js';

export type NodeRenderer = (opts: {
  depth?: number;
  name?: string;
  data?: unknown;
  isNonenumerable?: boolean;
}) => unknown;

@customElement('ix-tree-node')
export class TreeNode extends LitElement {
  static styles = [
    baseStyles,
    css`
      :host {
        display: block;
        box-sizing: border-box;
        cursor: default;
        color: var(--ix-base-color);
        background-color: var(--ix-base-background-color);
        line-height: var(--ix-treenode-line-height);
        font-family: var(--ix-treenode-font-family);
        font-size: var(--ix-treenode-font-size);
      }

      #arrow {
        display: inline-block;
        color: var(--ix-arrow-color);
        font-size: var(--ix-arrow-font-size);
        margin-right: var(--ix-arrow-margin-right);
        transition: transform var(--ix-arrow-animation-duration) ease 0s;
        user-select: none;
        transform: rotateZ(0deg);
      }

      #placeholder {
        white-space: pre;
        font-size: var(--ix-arrow-font-size);
        margin-right: var(--ix-arrow-margin-right);
        user-select: none;
      }

      slot {
        display: none;
        margin: 0;
        padding-left: var(--ix-treenode-padding-left);
      }

      :host([expanded]) {
        #arrow {
          transform: rotateZ(90deg);
        }
        slot {
          display: block;
        }
      }
    `,
  ];

  #slotController = new SlotController(this);

  @property({type: Boolean, reflect: true})
  accessor expanded = false;

  @property({attribute: false})
  accessor nodeRenderer: NodeRenderer | undefined;

  @property({type: Boolean})
  accessor shouldShowArrow = false;

  @property({type: Boolean})
  accessor shouldShowPlaceholder = false;

  @property()
  accessor name: string | undefined;

  @property({type: Object})
  accessor data: unknown;

  @property({type: Number})
  accessor depth = 0;

  @property({type: Boolean})
  accessor isNonenumerable = false;

  render() {
    const nodeRenderer =
      this.nodeRenderer ?? (({name}: any) => html`<span>${name}</span>`);
    return html`
      <div @click=${this.#onClick}>
        ${this.shouldShowArrow || this.#slotController.hasAssignedElements()
          ? html`<span id="arrow">▶</span>`
          : this.shouldShowPlaceholder
          ? html`<span id="placeholder">&nbsp;</span>`
          : null}
        ${nodeRenderer({
          name: this.name,
          data: this.data,
          depth: this.depth,
          isNonenumerable: this.isNonenumerable,
        })}
      </div>
      <slot role="group"></slot>
    `;
  }

  #onClick() {
    this.dispatchEvent(new ToggleExpandedEvent());
  }
}

export class ToggleExpandedEvent extends Event {
  static eventName = 'toggle-expanded';

  constructor() {
    super(ToggleExpandedEvent.eventName, {
      // bubbles: true,
      // composed: true,
      cancelable: true,
    });
  }
}
