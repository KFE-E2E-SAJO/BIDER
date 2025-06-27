import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { toast, Toaster } from '@repo/ui/components/Toast/sonner';
import { Button } from '@repo/ui/components/Button/Button';

// 메타 정보
const meta: Meta<typeof Toaster> = {
  title: 'COMPONENTS/Toaster',
  component: Toaster,
};
export default meta;

type Story = StoryObj<typeof Toaster>;

export const Toast: Story = {
  render: () => (
    <div className="flex items-center justify-center">
      <Toaster />
      <Button onClick={() => toast('저장되었습니다.')}>저장</Button>
    </div>
  ),
  name: 'Toast',
};
