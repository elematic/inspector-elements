import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {baseStyles} from '../styles/base-styles.js';
import type {TreeAdapter, TreeItem} from './tree-adapter.js';

@customElement('ix-tree-node')
export class TreeNode extends LitElement {
  static styles = [
    baseStyles,
    css`
      :host {
        display: flex;
        flex-direction: row;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        cursor: default;
        color: var(--ix-base-color);
        background-color: var(--ix-base-background-color);
        line-height: var(--ix-treenode-line-height);
        font-family: var(--ix-treenode-font-family);
        font-size: var(--ix-treenode-font-size);
      }

      #gutter {
        color: var(--ix-arrow-color);
        font-size: var(--ix-arrow-font-size);
        margin-right: var(--ix-arrow-margin-right);
        user-select: none;
        transform: rotateZ(0deg);
        flex: 0 0 1em;

        &.hidden:not(.placeholder) {
          width: 0;
        }

        &.hidden > #arrow {
          display: none;
        }
      }

      #container {
        flex: auto;
      }

      #arrow {
        display: inline-block;
        transition: transform var(--ix-arrow-animation-duration) ease 0s;
      }

      slot#children {
        display: none;
        margin: 0;
        padding-left: var(--ix-treenode-padding-left);
      }

      :host([expanded]) {
        #arrow {
          transform: rotateZ(90deg);
        }
        slot#children {
          display: block;
        }
      }
    `,
  ];

  @property({type: Boolean, reflect: true})
  expanded = false;

  @property({attribute: false})
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  treeAdapter: TreeAdapter<any> | undefined;

  @property({type: Boolean})
  showGutter = false;

  @property({attribute: false})
  item: TreeItem<unknown> | undefined;

  constructor() {
    super();
    this.addEventListener('click', this.#onClick);
  }

  get #showArrow() {
    return this.item && this.treeAdapter?.hasChildren(this.item.data);
  }

  render() {
    return html`
      <div
        id="gutter"
        class=${classMap({
          hidden: !this.#showArrow,
          placeholder: this.showGutter,
        })}
      >
        <span id="arrow">▶</span>
      </div>
      <div id="container">
        <slot name="label"></slot>
        <slot id="children" role="group"></slot>
      </div>
    `;
  }

  #onClick = (e: Event) => {
    if (!this.#showArrow) {
      return;
    }
    // Ignore clicks from within the children slot
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const slot = this.renderRoot.querySelector('slot#children')!;
    if (e.composedPath().includes(slot)) {
      return;
    }
    this.dispatchEvent(new ToggleExpandedEvent());
  };
}

export class ToggleExpandedEvent extends Event {
  static eventName = 'toggle-expanded';

  constructor() {
    super(ToggleExpandedEvent.eventName, {
      cancelable: true,
    });
  }
}
