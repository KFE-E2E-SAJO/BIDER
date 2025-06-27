import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Toaster as Toast } from '@repo/ui/components/Toast/Toast';
import { toast, Toaster } from '@repo/ui/components/Toast/Sonner';

// 메타 정보
const meta: Meta<typeof Toaster> = {
  title: 'COMPONENTS/Toaster',
  component: Toaster,
};
export default meta;

type Story = StoryObj<typeof Toaster>;

// Playground 스토리: 버튼 클릭 시 실제로 토스트 뜨는 예시
export const Playground: Story = {
  render: () => (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-4">
      {/* Toast는 반드시 한 번만! */}
      <Toaster />

      <button
        className="rounded bg-blue-600 px-4 py-2 text-white"
        onClick={() => toast('저장되었습니다.')}
      >
        저장 토스트 띄우기
      </button>
      <button
        className="rounded bg-neutral-700 px-4 py-2 text-white"
        onClick={() => toast('삭제되었습니다.')}
      >
        삭제 토스트 띄우기
      </button>
    </div>
  ),
  name: 'Playground (버튼 클릭시 Toast)',
};

// Visible 스토리: 항상 떠있는 모습만 미리보기 (props로 컨트롤)
export const Visible: Story = {
  render: (args) => (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-4">
      <Toaster {...args} />
      <div className="text-center text-gray-600">
        <p>실제 토스트를 보려면 Playground 스토리의 버튼을 클릭하세요.</p>
        <button
          className="mt-2 rounded bg-green-600 px-4 py-2 text-white"
          onClick={() => toast('미리보기 토스트입니다!')}
        >
          미리보기 토스트
        </button>
      </div>
    </div>
  ),
  name: 'Always Visible (스타일 미리보기)',
};
