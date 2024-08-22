import type {Preview} from '@storybook/web-components';
import type {Package} from 'custom-elements-manifest';
import {setCustomElementsManifest} from '@storybook/web-components';
import customElements from '../custom-elements.json';

export const removeStatic = (customElements: Package): Package => {
  customElements = structuredClone(customElements);
  for (const module of customElements.modules) {
    for (const declaration of module.declarations ?? []) {
      if (declaration.kind === 'class') {
        if (declaration.members !== undefined) {
          declaration.members = declaration.members.filter(
            (member) => member.kind !== 'field' || !member.static
          );
        }
      }
    }
  }
  return customElements;
};

setCustomElementsManifest(removeStatic(customElements as Package));
// setCustomElementsManifest(customElements as Package);

export default {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
} satisfies Preview;
