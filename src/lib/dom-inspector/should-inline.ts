import type {ElementData} from './types.js';

/**
 * Returns whether or the element should be rendered with its content inlined.
 *
 * This is true if the element has a single text child node with less than
 * 80 characters.
 */
export const shouldInlineContent = (
  data: ElementData,
  maxInlineChars = 80
): boolean =>
  data.nodeType === Node.ELEMENT_NODE &&
  data.childNodes?.length === 1 &&
  data.childNodes[0].nodeType === Node.TEXT_NODE &&
  data.childNodes[0].textContent?.length < maxInlineChars;
