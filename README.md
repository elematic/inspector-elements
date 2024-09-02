# inspector-elements

Web components for visually inspecting objects

## Install

```sh
npm i inspector-elements
```

## Usage

### Getting started

1. Import the elements:
    ```ts
    import 'inspector-elements';
    ```

2. Create an element:
    You can create an element in any way: DOM APIs, frameworks, template systems, etc.
    ```ts
    const inspector = document.createElement('ix-object-inspector');
    ```
3. Set the data:
    ```ts
    inspector.data = {foo: 'bar'};
    ```

## Elements

### &lt;ix-object-inspector>

Shows the properties and values of an object in a navigable tree.

Example (Lit template syntax):
```ts
const data = {
  string: 'foo',
  number: 42,
  array: [7, 8, 9],
  object: {foo: 'bar'},
};
return html`<ix-object-inspector .data=${data}></ix-object-inspector>`
```

#### Properties
- `data: any`: Any value to inspect
- `name: string`: Optional name of the root object
- `expandLevel: number`: An integer specifying to which level the tree should be initially expanded
- `expandPaths: string | Array<string>`: An array containing all the paths that should be expanded, or a string of just one path
- `showNonenumerable: boolean`: Whether to show non-enumerable properties
- `sortObjectKeys: boolean | ((a: PropertyKey, b: PropertyKey) => number)`: Sort object keys with optional compare function

### &lt;ix-dom-inspector>

Shows DOM elemets with attributes and children in a navigable tree.

Example (Lit):
```ts
const data = document.querySelector('#app');
return html`<ix-dom-inspector .data=${data}></ix-dom-inspector>`;
```

#### Properties
- `data: Node`: Any DOM Node to inspect

### &lt;ix-table-inspector>

Displays objects and properties in a table.

#### Properties
- `data: Record<string, unknown> | Array<unknown>`: An object or array
- `columns: Array<string>`: An array of column names to include in the output.

Example (Lit):
```ts
const data = ['apples', 'oranges', 'bananas'];
return html`<ix-table-inspector .data=${data}></ix-table-inspector>`;
```

## Styling

### Custom CSS Properties

- `--ix-base-font-family`
- `--ix-base-font-size`
- `--ix-base-line-height`
- `--ix-base-background-color`
- `--ix-base-color`
- `--ix-object-name-color`
- `--ix-object-value-null-color`
- `--ix-object-value-undefined-color`
- `--ix-object-value-regexp-color`
- `--ix-object-value-string-color`
- `--ix-object-value-symbol-color`
- `--ix-object-value-number-color`
- `--ix-object-value-boolean-color`
- `--ix-object-value-function-prefix-color`
- `--ix-object-preview-font-style`
- `--ix-html-tag-color`
- `--ix-html-tagname-color`
- `--ix-html-tagname-text-transform`
- `--ix-html-attribute-name-color`
- `--ix-html-attribute-value-color`
- `--ix-html-comment-color`
- `--ix-html-doctype-color`
- `--ix-arrow-color`
- `--ix-arrow-margin-right`
- `--ix-arrow-font-size`
- `--ix-arrow-animation-duration`
- `--ix-treenode-font-family`
- `--ix-treenode-font-size`
- `--ix-treenode-line-height`
- `--ix-treenode-padding-left`
- `--ix-table-border-color`
- `--ix-table-th-background-color`
- `--ix-table-th-hover-color`
- `--ix-table-sort-icon-color`
- `--ix-table-tr-even-background-color`
- `--ix-table-tr-odd-background-color`

## Status

This port is very much in progress!

- [ ] Elements
  - [x] `<ix-object-inspector>`
  - [x] `<ix-dom-inspector>`
  - [x] `<ix-table-inspector>`
- [ ] Add CSS Parts
- [ ] Tests
- [ ] Storybook
  - [x] Add Storybook to project
  - [ ] Hook up custom properties and attributes
  - [ ] Publish static storybook

## Acknowledgements

This is a web components port of the https://github.com/storybookjs/react-inspector
