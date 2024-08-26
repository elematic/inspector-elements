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
import {DEFAULT_ROOT_PATH, getExpandedPaths} from './path-utils.js';
import './tree-node.js';
import type {TreeAdapter, TreeItem} from './tree-adapter.js';

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
    `,
  ];

  @property({attribute: false})
  name: string | undefined;

  @property({attribute: false})
  data: unknown;

  @property({attribute: false})
  treeAdapter: TreeAdapter<unknown> | undefined;

  @property({attribute: false})
  expandPaths: string | Array<string> | undefined;

  @property({attribute: false})
  expandLevel: number | undefined;

  @state()
  expandedPaths: Set<string> | undefined;

  render() {
    return this.#renderNode({data: this.data, name: this.name ?? ''}, 0);
  }

  protected willUpdate(changedProperties: PropertyValues): void {
    if (
      (changedProperties.has('data') ||
        changedProperties.has('dataIterator') ||
        changedProperties.has('expandPaths') ||
        changedProperties.has('expandLevel')) &&
      this.treeAdapter !== undefined
    ) {
      const expandPaths = Array.isArray(this.expandPaths)
        ? this.expandPaths
        : this.expandPaths === undefined
        ? []
        : [this.expandPaths];
      this.expandedPaths = new Set(
        getExpandedPaths(
          this.data,
          this.treeAdapter,
          expandPaths,
          this.expandLevel,
          this.expandedPaths
        )
      );
    }
  }

  #renderNode(
    item: TreeItem<unknown>,
    depth: number,
    parentPath?: string
  ): TemplateResult {
    const path =
      parentPath === undefined
        ? DEFAULT_ROOT_PATH
        : `${parentPath}.${item.name}`;
    const expanded = this.expandedPaths?.has(path) || item.expanded || false;

    return html`<ix-tree-node
      .item=${item}
      .treeAdapter=${this.treeAdapter}
      .depth=${depth}
      .expanded=${expanded}
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
      >${map(this.treeAdapter?.children(item.data), (child) =>
        this.#renderNode(child, depth + 1, path)
      )}</ix-tree-node
    >`;
  }
}
