import type { Meta, StoryObj } from '@storybook/react-vite';
import { CustomToastOptions, toast, Toaster } from '@repo/ui/components/Toast/Sonner';
import { Button } from '@repo/ui/components/Button/Button';

const ToastStory = ({ content, duration }: CustomToastOptions) => {
  return (
    <Button
      onClick={() => toast({ content, duration })}
      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
    >
      Show Toast
    </Button>
  );
};

// 메타 정보
const meta: Meta<typeof ToastStory> = {
  title: 'Components/Toast',
  component: ToastStory,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Custom toast notification system built with Sonner and next-themes integration. Use the controls to customize the toast message and duration.',
      },
    },
  },
  argTypes: {
    content: {
      control: 'text',
      description: 'The message content to display in the toast',
    },
    duration: {
      control: {
        type: 'range',
        min: 1000,
        max: 10000,
        step: 500,
      },
      description: 'Duration in milliseconds before the toast auto-dismisses',
    },
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
        <Toaster />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ToastStory>;

// 기본 스토리 - controls로 조정 가능
export const Interactive: Story = {
  args: {
    content: '저장되었습니다.',
    duration: 3000,
  },
};

// 프리셋 스토리들
export const ShortMessage: Story = {
  args: {
    content: 'Quick message',
    duration: 1000,
  },
};

export const LongMessage: Story = {
  args: {
    content:
      'This is a much longer toast message that demonstrates how the component handles extended content with proper text wrapping and layout.',
    duration: 5000,
  },
};

export const MultilineMessage: Story = {
  args: {
    content: 'First line of the message\nSecond line of the message\nThird line of the message',
    duration: 4000,
  },
};
