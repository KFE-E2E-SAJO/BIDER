import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '@repo/ui/components/Button/Button';
import { Dialog, type DialogProps } from '@repo/ui/components/Dialog/Dialog';
import { CircleCheck, Clock, Heart, MapPin, Star, TriangleAlert } from 'lucide-react';

// 🔧 타입 안전한 Modal 제어 Wrapper 컴포넌트
interface DialogWrapperProps extends Omit<DialogProps, 'open' | 'onOpenChange'> {
  children: React.ReactNode;
}

const DialogWrapper = ({ children, ...dialogProps }: DialogWrapperProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>모달 열기</Button>
      <Dialog
        {...dialogProps}
        open={isOpen}
        onOpenChange={(open) => setIsOpen(open)} // 🔧 boolean 매개변수 수용
      >
        {children}
      </Dialog>
    </>
  );
};

const meta = {
  title: 'Components/Dialog',
  component: DialogWrapper,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: {
      control: 'text',
      description: '모달 제목',
    },
    buttonLayout: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: '버튼 레이아웃 방향',
    },
    hideActions: {
      control: 'boolean',
      description: '액션 버튼 영역 숨김 여부',
    },
    closeOnBackdropClick: {
      control: 'boolean',
      description: '배경 클릭시 닫기 여부',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'ESC 키로 닫기 여부',
    },
    showCloseButton: {
      control: 'boolean',
      description: '닫기 버튼(X) 표시 여부',
    },
    confirmText: {
      control: 'text',
      description: '확인 버튼 텍스트',
    },
    cancelText: {
      control: 'text',
      description: '취소 버튼 텍스트',
    },
    onConfirm: {
      action: 'confirmed',
      description: '확인 버튼 클릭 핸들러',
    },
    onCancel: {
      action: 'cancelled',
      description: '취소 버튼 클릭 핸들러',
    },
  },
} satisfies Meta<typeof DialogWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AuctionSuccess: Story = {
  args: {
    title: '입찰에 성공하였습니다!',
    confirmText: '결제하러 가기',
    buttonLayout: 'vertical',
    showCloseButton: true,
    children: (
      <div className="space-y-4">
        <p className="text-sm">
          3시간 이내에 결제를 완료해주세요.
          <br />
          시간 내 결제가 없을 경우,
          <br />
          다른 분께 입찰 기회가 넘어갑니다.
        </p>
        <div className="flex items-center justify-center gap-2 text-blue-600">
          <Clock width={16} height={16} />
          <span className="text-sm">남은 시간 2:58:31</span>
        </div>
      </div>
    ),
  },
};

export const FavoriteStore: Story = {
  args: {
    title: '즐겨찾기 하시겠습니까?',
    confirmText: '즐겨찾기하고 쿠폰 받기',
    cancelText: '취소',
    buttonLayout: 'vertical',
    showCloseButton: true,
    children: (
      <div className="space-y-2">
        <p className="text-sm">
          사조님의 상점을 즐겨찾기하면 쿠폰을
          <br />
          드려요! 지금 즐겨찾기하고 쿠폰을 받
          <br />
          으시겠어요?
        </p>
      </div>
    ),
  },
};

export const HorizontalButtons: Story = {
  args: {
    title: '로그아웃 하시겠습니까?',
    confirmText: '로그아웃',
    cancelText: '취소',
    buttonLayout: 'horizontal',
    showCloseButton: true,
    children: <p className="text-sm">현재 세션이 종료되며 다시 로그인해야 합니다.</p>,
  },
};

export const VerticalButtons: Story = {
  args: {
    title: '계정을 삭제하시겠습니까?',
    confirmText: '계정 영구 삭제',
    cancelText: '취소',
    buttonLayout: 'vertical',
    showCloseButton: true,
    children: (
      <div className="space-y-3">
        <div className="flex items-start justify-center gap-3">
          <TriangleAlert className="mt-1 text-xl text-red-500" />
          <div>
            <p className="text-sm">
              삭제된 계정은 복구할 수 없습니다.
              <br />
              모든 데이터가 영구적으로 삭제됩니다.
            </p>
          </div>
        </div>
      </div>
    ),
  },
};

export const NoButtons: Story = {
  args: {
    title: '알림',
    hideActions: true,
    showCloseButton: true,
    children: (
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <CircleCheck className="text-xl text-green-500" />
          <p className="text-sm">설정이 저장되었습니다!</p>
        </div>
      </div>
    ),
  },
};

export const NoCloseButton: Story = {
  args: {
    title: '중요한 공지사항',
    confirmText: '확인했습니다',
    buttonLayout: 'vertical',
    showCloseButton: false, // 🔧 닫기 버튼 숨김
    closeOnBackdropClick: false,
    closeOnEscape: false,
    children: (
      <div className="space-y-3">
        <p className="text-sm">
          이 공지사항을 반드시 확인해주세요.
          <br />
          확인 버튼을 눌러야만 계속 진행할 수 있습니다.
        </p>
      </div>
    ),
  },
};

export const InteractionOptions: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-h3 mb-3">🔧 상호작용 옵션 테스트</h3>
        <div className="flex flex-wrap gap-3">
          {/* 배경 클릭 비활성화 */}
          <DialogWrapper
            title="중요한 선택"
            confirmText="확인"
            cancelText="취소"
            closeOnBackdropClick={false}
            buttonLayout="horizontal"
          >
            <p className="text-body">
              배경을 클릭해도 닫히지 않습니다.
              <br />
              반드시 버튼을 선택해주세요.
            </p>
          </DialogWrapper>

          {/* ESC 키 비활성화 */}
          <DialogWrapper
            title="필수 확인"
            confirmText="동의"
            closeOnEscape={false}
            buttonLayout="vertical"
          >
            <p className="text-body">
              ESC 키로 닫을 수 없습니다.
              <br />
              반드시 동의 버튼을 눌러주세요.
            </p>
          </DialogWrapper>
        </div>
      </div>
    </div>
  ),
  args: {
    children: '상호작용 옵션 테스트',
    title: '상호작용 테스트',
    confirmText: '확인',
    closeOnBackdropClick: true,
    closeOnEscape: true,
  },
};

export const Interactive: Story = {
  render: () => {
    const [result, setResult] = useState('');

    return (
      <div className="space-y-4">
        <DialogWrapper
          title="인터랙티브 테스트"
          confirmText="확인"
          cancelText="취소"
          showCloseButton={true}
          onConfirm={() => setResult('✅ 확인 버튼이 클릭되었습니다!')}
          onCancel={() => setResult('❌ 취소 버튼이 클릭되었습니다!')}
        >
          <p className="text-sm">
            버튼을 클릭하여 모달의 동작을 테스트해보세요.
            <br />
            결과가 아래에 표시됩니다.
          </p>
        </DialogWrapper>

        {result && (
          <div className="mt-4 rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-800">{result}</p>
          </div>
        )}
      </div>
    );
  },
  args: {
    children: '인터랙티브 테스트 내용',
    title: '인터랙티브 테스트',
    confirmText: '확인',
    cancelText: '취소',
  },
};
