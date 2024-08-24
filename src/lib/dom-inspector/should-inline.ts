import type {NodeData} from './dom-node-preview.js';

const TEXT_NODE_MAX_INLINE_CHARS = 80;

export const shouldInline = (data: NodeData) =>
  data.childNodes === undefined ||
  data.childNodes.length === 0 ||
  (data.childNodes.length === 1 &&
    data.childNodes[0].nodeType === Node.TEXT_NODE &&
    (data.textContent === undefined ||
      data.textContent.length < TEXT_NODE_MAX_INLINE_CHARS));
