import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {baseStyles} from '../styles/base-styles.js';
import {SlotController} from '../utils/slot-controller.js';
import {classMap} from 'lit/directives/class-map.js';
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
  expanded = false;

  @property({attribute: false})
  treeAdapter: TreeAdapter<unknown> | undefined;

  @property({type: Boolean})
  shouldShowArrow = false;

  @property({type: Boolean})
  shouldShowPlaceholder = false;

  @property({attribute: false})
  item: TreeItem<unknown> | undefined;

  @property({type: Number})
  depth = 0;

  @property({type: Boolean})
  isNonEnumerable = false;

  constructor() {
    super();
    this.addEventListener('click', this.#onClick);
  }

  render() {
    const nodeRenderer =
      this.treeAdapter?.render ??
      (({name}: {name?: string}) =>
        html`<span>${name}</span><slot role="group"></slot>`);
    const showArrow =
      this.shouldShowArrow || this.#slotController.hasAssignedElements();

    console.log('TreeNode render()', this.item?.name, this.item?.expanded);

    return html`
      <div
        id="gutter"
        class=${classMap({
          hidden: !showArrow,
          placeholder: this.shouldShowPlaceholder,
        })}
      >
        <span id="arrow">▶</span>
      </div>
      <div id="container">
        ${nodeRenderer({
          data: this.item?.data,
          name: this.item?.name,
          expanded: this.expanded || (this.item?.expanded ?? false),
          depth: this.depth,
          isNonEnumerable:
            this.isNonEnumerable ||
            this.item?.isNonEnumerable ||
            this.item?.synthetic,
        })}
      </div>
    `;
  }

  #onClick(e: Event) {
    // Ignore clicks from within the slot, which are from children of this
    // tree node.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const slot = this.shadowRoot!.querySelector('slot');
    if (slot !== null && e.composedPath().includes(slot)) {
      return;
    }
    this.dispatchEvent(new ToggleExpandedEvent());
  }
}

export class ToggleExpandedEvent extends Event {
  static eventName = 'toggle-expanded';

  constructor() {
    super(ToggleExpandedEvent.eventName, {
      cancelable: true,
    });
  }
}
