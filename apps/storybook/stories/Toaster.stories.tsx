import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { toast, Toast } from '@repo/ui/components/Toast/sonner';
import { Button } from '@repo/ui/components/Button/Button';

// 메타 정보
const meta: Meta<typeof Toast> = {
  title: 'COMPONENTS/Toaster',
  component: Toast,
};
export default meta;

type Story = StoryObj<typeof Toast>;

export const ToastStory: Story = {
  render: () => (
    <div className="flex items-center justify-center">
      <Toast />
      <Button onClick={() => toast('저장되었습니다.')}>저장</Button>
    </div>
  ),
  name: 'Toast',
};
