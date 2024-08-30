import type {Meta, StoryObj} from '@storybook/web-components';
import '../lib/table-inspector/table-inspector.js';
import {html} from 'lit';

interface ObjectInspectorProps {
  data: Record<string, unknown> | Array<unknown> | undefined;
}

export default {
  title: 'Components/ix-table-inspector',
  component: 'ix-table-inspector',
  tags: ['autodocs'],
  render: ({data}) =>
    html`<ix-table-inspector .data=${data}></ix-table-inspector>`,
  argTypes: {
    data: {control: 'object'},
  },
  args: {},
} satisfies Meta<ObjectInspectorProps>;

type Story = StoryObj<ObjectInspectorProps>;

export const Array: Story = {
  args: {
    data: [
      ['Name', 'Address', 'Age', 'Phone'],
      ['John Appleseed', '42 Galaxy drive', '20', '111-111-1111'],
    ],
  },
};

export const DifferentColumns: Story = {
  args: {
    data: {
      0: {firstName: 'John', lastName: 'Smith'},
      1: {firstName: 'Martin', middleName: 'Luther', lastName: 'King'},
    },
  },
};

export const DifferentColumnsWithNames: Story = {
  name: 'Different columns with names',
  args: {
    data: {
      person1: {firstName: 'John', lastName: 'Smith'},
      person2: {
        firstName: 'Martin',
        middleName: 'Luther',
        lastName: 'King',
      },
    },
  },
};
