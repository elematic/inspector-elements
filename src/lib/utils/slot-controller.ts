import type {ReactiveController, ReactiveControllerHost} from 'lit';

/**
 * A reactive controller that updates a host when slotted content changes and
 * provides helper methods for checking and getting assigned slot content.
 */
export class SlotController implements ReactiveController {
  private _host: ReactiveControllerHost & Element;
  private _slotNames?: ReadonlyArray<string>;

  constructor(
    host: ReactiveControllerHost & Element,
    slotNames?: ReadonlyArray<string>
  ) {
    (this._host = host).addController(this);
    this._slotNames = slotNames;
  }

  getAssignedNodes(slotName?: string) {
    const slotSelector = `slot${
      slotName ? `[name=${slotName}]` : ':not([name])'
    }`;
    const slot =
      this._host.shadowRoot!.querySelector<HTMLSlotElement>(slotSelector);
    return slot === null ? undefined : slot.assignedNodes({flatten: true});
  }

  hasAssignedNodes(slotName?: string) {
    const assignedNodes = this.getAssignedNodes(slotName);
    return assignedNodes === undefined ? false : assignedNodes.length > 0;
  }

  getAssignedElements(slotName?: string) {
    const slotSelector = `slot${
      slotName ? `[name=${slotName}]` : ':not([name])'
    }`;
    const slot =
      this._host.shadowRoot!.querySelector<HTMLSlotElement>(slotSelector);
    return slot === null ? undefined : slot.assignedElements({flatten: true});
  }

  hasAssignedElements(slotName?: string) {
    const assignedElements = this.getAssignedElements(slotName);
    return assignedElements === undefined ? false : assignedElements.length > 0;
  }

  hostConnected() {
    this._host.shadowRoot!.addEventListener('slotchange', this._onSlotChange);
  }

  hostDisconnected() {
    this._host.shadowRoot!.removeEventListener(
      'slotchange',
      this._onSlotChange
    );
  }

  private _onSlotChange = (event: Event) => {
    const slot = event.target as HTMLSlotElement;

    if (this._slotNames === undefined || this._slotNames.includes(slot.name)) {
      this._host.requestUpdate();
    }
  };
}
