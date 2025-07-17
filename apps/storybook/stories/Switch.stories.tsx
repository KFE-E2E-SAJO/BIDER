import { Switch } from '@repo/ui/components/Switch/Switch';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  args: {
    checked: false,
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Switch 상태 (On/Off)',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 여부',
    },
    onCheckedChange: {
      action: 'checkedChange',
      description: '체크 상태가 변경될 때 실행되는 함수',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    checked: true,
  },
};
