import {
  LitElement,
  css,
  html,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {map} from 'lit/directives/map.js';
import {baseStyles} from '../styles/base-styles.js';
import {
  DEFAULT_ROOT_PATH,
  getExpandedPaths,
  type DataIterator,
} from './path-utils.js';
import './tree-node.js';
import type {NodeRenderer} from './tree-node.js';

export type {NodeRenderer} from './tree-node.js';

@customElement('ix-tree-view')
export class TreeView extends LitElement {
  static styles = [
    baseStyles,
    css`
      :host {
        display: block;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      ix-tree-node > ix-tree-node {
        padding-left: 12px;
      }
    `,
  ];

  @property({attribute: false})
  name: string | undefined;

  @property({attribute: false})
  data: unknown;

  @property({attribute: false})
  dataIterator: DataIterator | undefined;

  @property({attribute: false})
  nodeRenderer: NodeRenderer | undefined;

  @property({attribute: false})
  expandPaths: string | Array<string> | undefined;

  @property({attribute: false})
  expandLevel: number | undefined;

  @state()
  expandedPaths: Set<string> | undefined;

  render() {
    return this.#renderNode(this.name ?? '', this.data, 0);
  }

  protected willUpdate(changedProperties: PropertyValues): void {
    if (
      (changedProperties.has('data') ||
        changedProperties.has('dataIterator') ||
        changedProperties.has('expandPaths') ||
        changedProperties.has('expandLevel')) &&
      this.dataIterator !== undefined
    ) {
      const expandPaths = Array.isArray(this.expandPaths)
        ? this.expandPaths
        : this.expandPaths === undefined
        ? []
        : [this.expandPaths];
      this.expandedPaths = new Set(
        getExpandedPaths(
          this.data,
          this.dataIterator,
          expandPaths,
          this.expandLevel,
          this.expandedPaths
        )
      );
    }
  }

  #renderNode(
    name: string,
    data: unknown,
    depth: number,
    parentPath?: string
  ): TemplateResult {
    const path =
      parentPath === undefined ? DEFAULT_ROOT_PATH : `${parentPath}.${name}`;
    const expanded = this.expandedPaths?.has(path) ?? false;
    return html`<ix-tree-node
      .name=${name}
      .data=${data}
      .depth=${depth}
      .expanded=${expanded}
      .dataIterator=${this.dataIterator}
      .nodeRenderer=${this.nodeRenderer}
      .shouldShowPlaceholder=${depth > 0}
      @toggle-expanded=${() => {
        const expandedPaths = new Set(this.expandedPaths);
        if (expandedPaths.has(path)) {
          expandedPaths.delete(path);
        } else {
          expandedPaths.add(path);
        }
        this.expandedPaths = expandedPaths;
      }}
      >${map(this.dataIterator?.(data), (item) =>
        this.#renderNode(item.name, item.data, depth + 1, path)
      )}</ix-tree-node
    >`;
  }
}
