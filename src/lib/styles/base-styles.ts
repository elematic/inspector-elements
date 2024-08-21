import { css } from 'lit';

export const baseStyles = css`
  :host {
    --ix-base-font-family: Menlo, monospace;
    --ix-base-font-size: 11px;
    --ix-base-line-height: 1.2;

    --ix-base-background-color: white;
    --ix-base-color: black;

    --ix-object-name-color: rgb(136, 19, 145);
    --ix-object-value-null-color: rgb(128, 128, 128);
    --ix-object-value-undefined-color: rgb(128, 128, 128);
    --ix-object-value-regexp-color: rgb(196, 26, 22);
    --ix-object-value-string-color: rgb(196, 26, 22);
    --ix-object-value-symbol-color: rgb(196, 26, 22);
    --ix-object-value-number-color: rgb(28, 0, 207);
    --ix-object-value-boolean-color: rgb(28, 0, 207);
    --ix-object-value-function-prefix-color: rgb(13, 34, 170);

    --ix-html-tag-color: rgb(168, 148, 166);
    --ix-html-tagname-color: rgb(136, 18, 128);
    --ix-html-tagname-text-transform: lowercase;
    --ix-html-attribute-name-color: rgb(153, 69, 0);
    --ix-html-attribute-value-color: rgb(26, 26, 166);
    --ix-html-comment-color: rgb(35, 110, 37);
    --ix-html-doctype-color: rgb(192, 192, 192);

    --ix-arrow-color: #6e6e6e;
    --ix-arrow-margin-right: 3;
    --ix-arrow-font-size: 12;
    --ix-arrow-animation-duration: 0;

    --ix-treenode-font-family: Menlo, monospace;
    --ix-treenode-font-size: 11px;
    --ix-treenode-line-height: 1.2;
    --ix-treenode-padding-left: 12;

    --ix-table-border-color: #aaa;
    --ix-table-th-background-color: #eee;
    --ix-table-th-hover-color: hsla(0, 0%, 90%, 1);
    --ix-table-sort-icon-color: #6e6e6e;
    --ix-table-data-background-image:
      linear-gradient(to bottom, white, white 50%, rgb(234, 243, 255) 50%, rgb(234, 243, 255));
    --ix-table-data-background-size: 128px 32px;
  }
`;
