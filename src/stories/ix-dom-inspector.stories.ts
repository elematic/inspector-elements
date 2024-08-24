import type {Meta, StoryObj} from '@storybook/web-components';
import {} from '@storybook/web-components';
import '../lib/dom-inspector/dom-inspector.js';
import {html} from 'lit';
import type {NodeData} from '../lib/dom-inspector/dom-node-preview.js';

interface ObjectInspectorProps {
  expandLevel: number;
  expandPaths: string | Array<string> | undefined;
  name: string | undefined;
  data: NodeData;
  showNonenumerable: boolean;
  sortObjectKeys: boolean | ((a: PropertyKey, b: PropertyKey) => number);
}

export default {
  title: 'Components/ix-dom-inspector',
  component: 'ix-dom-inspector',
  tags: ['autodocs'],
  render: ({name, data, expandLevel, expandPaths}) =>
    html`<ix-dom-inspector
      .name=${name}
      .data=${data}
      .expandLevel=${expandLevel}
      .expandPaths=${expandPaths}
    ></ix-dom-inspector>`,
  argTypes: {
    expandLevel: {control: 'number'},
    expandPaths: {control: 'object'},
    name: {control: 'text'},
    data: {control: 'object'},
    showNonenumerable: {control: 'boolean'},
  },
  args: {},
} satisfies Meta<ObjectInspectorProps>;

type Story = StoryObj<ObjectInspectorProps>;

export const MixedObject: Story = {
  args: {
    name: 'Mixed Object',
    data: {
      nodeName: 'div',
      nodeType: 1,
      tagName: 'div',
      attributes: [],
      childNodes: [
        {
          nodeName: 'span',
          nodeType: 1,
          tagName: 'span',
          attributes: [],
          childNodes: [],
        },
      ],
    },
    expandLevel: 1,
    expandPaths: '$.object',
  },
};
