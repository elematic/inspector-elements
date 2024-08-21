# inspector-elements

Web components for visually inspecting objects

## Install

```sh
npm i inspector-elements
```

## Getting started

---

### &lt;ix-object-inspector>

Shows the properties and values of an object in a navigable tree.

Example (Lit):
```ts
html`<ix-object-inspector .data=${data}></ix-object-inspector>`
```

_TBD API docs_

## Status

This port is very much in progress!

- [ ] Elements
  - [x] `<ix-object-inspector>`
  - [ ] `<ix-dom-inspector>`
  - [ ] `<ix-table-inspector>`
- [ ] Tests
- [ ] Storybook

## Acknowledgements

This is a web components port of the https://github.com/storybookjs/react-inspector
