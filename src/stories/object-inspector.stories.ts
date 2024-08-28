import type {Meta, StoryObj} from '@storybook/web-components';
import '../lib/object-inspector/object-inspector.js';
import {html} from 'lit';

interface ObjectInspectorProps {
  expandLevel: number;
  expandPaths: string | Array<string> | undefined;
  name: string | undefined;
  data: unknown;
  showNonenumerable: boolean;
  sortObjectKeys: boolean | ((a: PropertyKey, b: PropertyKey) => number);
}

export default {
  title: 'Components/ix-object-inspector',
  component: 'ix-object-inspector',
  tags: ['autodocs'],
  render: ({name, data, expandLevel, expandPaths}) =>
    html`<ix-object-inspector
      .name=${name}
      .data=${data}
      .expandLevel=${expandLevel}
      .expandPaths=${expandPaths}
    ></ix-object-inspector>`,
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

const map = new Map([['key', 'value']]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(map as any).foo = 'bar';
const set = new Set(['foo', 'bar']);
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(set as any).foo = 'bar';

export const MixedObject: Story = {
  args: {
    name: 'Mixed Object',
    data: {
      string: 'foo',
      number: 42,
      array: [7, 8, 9],
      object: {foo: 'bar'},
      date: new Date(),
      regexp: /foo/,
      map: Object.freeze(map),
      set: Object.freeze(set),
    },
    expandLevel: 1,
    expandPaths: '$.object',
  },
};

export const UndefinedData: Story = {
  args: {
    name: 'UndefinedData',
    data: undefined,
  },
};

export const StringData: Story = {
  args: {
    name: 'StringData',
    data: 'Hello, World!',
  },
};

export const ArrayData: Story = {
  args: {
    name: 'ArrayData',
    data: [
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
    ],
  },
};

export const MapData: Story = {
  args: {
    name: 'MapData',
    data: Object.freeze(new Map([['key', 'value']])),
  },
};

export const NoRootName: Story = {
  args: {
    name: undefined,
    data: {
      string: 'foo',
      number: 42,
      array: [7, 8, 9],
      object: {foo: 'bar'},
    },
  },
};
