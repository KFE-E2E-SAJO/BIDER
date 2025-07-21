import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '@repo/ui/components/Input/Input';

const meta: Meta<typeof Input> = {
  title: 'components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: '',
    placeholder: '내용을 입력해주세요',
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const Typing: Story = {
  args: {
    status: 'typing',
  },
};

export const WithIcon: Story = {
  args: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#000000"
      >
        <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" />
      </svg>
    ),
    placeholder: '아이디를 입력해주세요.',
  },
};
export const WithLabel: Story = {
  args: {
    label: '받으실 분',
    required: true,
  },
};

export const Error: Story = {
  args: {
    status: 'error',
    errorMessage: '문제가 발생했습니다.',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
