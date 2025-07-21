import Checkbox from '@repo/ui/components/Checkbox/Checkbox';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    label: '체크박스 라벨입니다',
    disabled: false,
  },
  argTypes: {
    label: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  name: 'Default',
  render: (args) => <Checkbox id="checkbox" {...args} />,
};
