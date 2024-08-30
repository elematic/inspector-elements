/**
 * Specs:
 * https://developer.chrome.com/devtools/docs/commandline-api#tabledata-columns
 * https://developer.mozilla.org/en-US/docs/Web/API/Console/table
 */

import {LitElement, css, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import '../object/object-value.js';
import {baseStyles} from '../styles/base-styles.js';
import {hasOwn} from '../utils/property-utils.js';
import {getHeaders} from './get-headers.js';

const lt = <T>(v1: T, v2: T) => {
  if (v1 < v2) {
    return -1;
  } else if (v1 > v2) {
    return 1;
  } else {
    return 0;
  }
};

const comparator = <T, V>(mapper: (v: T) => V, ascending = false) => {
  return (a: T, b: T) => {
    const v1 = mapper(a); // the datum
    const v2 = mapper(b);
    const type1 = typeof v1;
    const type2 = typeof v2;
    // use '<' operator to compare same type of values or compare type precedence order #
    let result;
    if (type1 === type2) {
      result = lt(v1, v2);
    } else {
      // order of different types
      const order = {
        string: 0,
        number: 1,
        object: 2,
        symbol: 3,
        boolean: 4,
        undefined: 5,
        function: 6,
      } as Record<string, number>;
      result = lt(order[type1], order[type2]);
    }
    // reverse result if descending
    if (!ascending) result = -result;
    return result;
  };
};

declare global {
  interface HTMLElementTagNameMap {
    'ix-table-inspector': TableInspector;
  }
}

@customElement('ix-table-inspector')
export class TableInspector extends LitElement {
  static styles = [
    baseStyles,
    css`
      table {
        border-collapse: collapse;
        width: 100%;

        color: var(--ix-base-color);
        font-family: var(--ix-base-font-family);
        font-size: var(--ix-base-font-size);
        line-height: 120%;
        box-sizing: border-box;

        /* position: static; */
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        border-top: 0 none transparent;
        margin: 0; // prevent user agent stylesheet overrides

        background-image: var(--ix-table-data-background-image);
        background-size: var(--ix-table-data-background-size);
        table-layout: fixed;

        /* border-spacing: 0;
        border-collapse: separate; */
        // height: '100%',
        width: 100%;

        font-size: var(--ix-base-font-size);
        line-height: 120%;

        border: 1px solid var(--ix-table-border-color);
      }

      .TableInspectorSortIcon {
        display: block;
        margin-right: 3; // 4,
        width: 8;
        height: 7;
        margin-top: -7;
        color: var(--ix-table-sort-icon-color);
        font-size: 12;
        // lineHeight: 14
        user-select: none;
      }

      td {
        box-sizing: border-box;
        /* border: none; // prevent overrides */
        height: 16px; // /* 0.5 * table.background-size height */
        vertical-align: top;
        padding: 1px 4px;
        user-select: none;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        line-height: 14px;
        border-left: 1px solid var(--ix-table-border-color);
      }

      th {
        font-weight: normal;
        border-left: 1px solid var(--ix-table-border-color);
        text-align: left;
        padding: 1px 4px;
      }

      tr:nth-child(even of :not(.header)) {
        background-color: var(--ix-table-tr-even-background-color);
      }

      tr:nth-child(odd of :not(.header)) {
        background-color: var(--ix-table-tr-odd-background-color);
      }

      tr.header {
        background-color: var(--ix-table-th-background-color);
        border-bottom: 1px solid var(--ix-table-border-color);
      }

      .TableInspectorSortIconContainer {
        display: flex;
        position: absolute;
        top: 1;
        right: 0;
        bottom: 1;
        align-items: center;
      }
    `,
  ];

  /**
   * The JS object you would like to inspect, either an array or an object.
   */
  @property({type: Object})
  data: Record<string, unknown> | Array<unknown> | undefined;

  /**
   * An array of the names of the columns you'd like to display in the table
   */
  @property({type: Array})
  columns: Array<string> | undefined;

  // has user ever clicked the <th> tag to sort?
  @state()
  private _sorted = false;

  // is index column sorted?
  @state()
  private _sortIndexColumn = false;

  // which column is sorted?
  @state()
  private _sortColumn?: string;

  // is sorting ascending or descending?
  @state()
  private _sortAscending = false;

  #onIndexTHClick = () => {
    this._sorted = true;
    this._sortIndexColumn = true;
    this._sortColumn = undefined;
    // when changed to a new column, default to asending
    this._sortAscending = this._sortIndexColumn ? !this._sortAscending : true;
  };

  #onTHClick = (col: string) => {
    console.log('onTHClick', col);
    this._sorted = true;
    this._sortIndexColumn = false;
    // update sort column
    this._sortColumn = col;
    // when changed to a new column, default to asending
    this._sortAscending =
      col === this._sortColumn ? !this._sortAscending : true;
  };

  render() {
    if (
      this.data === undefined ||
      this.data === null ||
      typeof this.data !== 'object'
    ) {
      return;
    }

    let {rowHeaders, colHeaders} = getHeaders(this.data);

    // columns to be displayed are specified
    // NOTE: there's some space for optimization here
    if (this.columns !== undefined) {
      colHeaders = this.columns;
    }

    let rowsData = rowHeaders.map(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (rowHeader) => this.data![rowHeader as keyof typeof this.data]
    );

    let columnDataWithRowIndexes: Array<[unknown, number]> | undefined =
      undefined; /* row indexes are [0..nRows-1] */
    // TODO: refactor
    if (this._sortColumn !== undefined) {
      // the column to be sorted (rowsData, column) => [[columnData, rowIndex]]
      columnDataWithRowIndexes = rowsData.map((rowData, index: number) => {
        // normalize rowData
        if (
          typeof rowData === 'object' &&
          rowData !== null /*&& rowData.hasOwnProperty(sortColumn)*/
        ) {
          const columnData = rowData[this._sortColumn as keyof typeof rowData];
          return [columnData, index];
        }
        return [undefined, index];
      });
    } else {
      if (this._sortIndexColumn) {
        columnDataWithRowIndexes = rowHeaders.map((_rowData, index: number) => {
          const columnData = rowHeaders[index];
          return [columnData, index];
        });
      }
    }
    if (columnDataWithRowIndexes !== undefined) {
      // apply a mapper before sorting (because we need to access inside a container)

      const sortedRowIndexes = columnDataWithRowIndexes
        .sort(
          comparator((item: [unknown, number]) => item[0], this._sortAscending)
        )
        .map((item) => item[1]); // sorted row indexes
      rowHeaders = sortedRowIndexes.map((i) => rowHeaders[i]);
      rowsData = sortedRowIndexes.map((i) => rowsData[i]);
    }

    return html`<table>
      ${this.#renderHeader(colHeaders)}
      ${this.#renderData({
        rowHeaders,
        colHeaders,
        rowsData,
      })}
    </table>`;
  }

  #renderHeader(colHeaders: Array<PropertyKey>) {
    return html`<tr class="header">
      <th @click=${this.#onIndexTHClick}>(index)</th>
      ${colHeaders.map((col) => {
        const glyph = this._sortAscending ? '▲' : '▼';
        return html`<th @click=${() => this.#onTHClick(col as string)}>
          ${col}
          ${this._sorted && this._sortColumn === col
            ? html`<div class="TableInspectorSortIconContainer">
                <div class="TableInspectorSortIcon">${glyph}</div>
              </div>`
            : undefined}
        </th>`;
      })}
    </tr>`;
  }

  #renderData({
    rowHeaders,
    colHeaders,
    rowsData,
  }: {
    rowHeaders: Array<PropertyKey>;
    colHeaders: Array<PropertyKey>;
    rowsData: Array<unknown>;
  }) {
    return rowHeaders.map((rowHeader, i) => {
      const rowData = rowsData[i];
      return html`<tr>
        <th>${rowHeader}</th>
        ${colHeaders.map((col) => {
          return html`<td>
            ${typeof rowData === 'object' &&
            rowData !== null &&
            hasOwn(rowData, col)
              ? html`<ix-object-value
                  .data=${rowData[col as keyof typeof rowData]}
                ></ix-object-value>`
              : undefined}
          </td>`;
        })}
      </tr>`;
    });
  }
}
