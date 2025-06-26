import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '@repo/ui/components/Button/Button';
import { Dialog, type DialogProps } from '@repo/ui/components/Dialog/Dialog';
import { CircleCheck, Clock, Heart, MapPin, Star, TriangleAlert } from 'lucide-react';

interface DialogWrapperProps extends Omit<DialogProps, 'open' | 'onOpenChange'> {
  children: React.ReactNode;
}

const DialogWrapper = ({ children, ...dialogProps }: DialogWrapperProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>모달 열기</Button>
      <Dialog {...dialogProps} open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
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
  },
} satisfies Meta<typeof DialogWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AuctionSuccess: Story = {
  args: {
    title: '입찰에 성공하였습니다!',
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

export const InteractionOptions: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-h3 mb-3">🔧 상호작용 옵션 테스트</h3>
        <div className="flex flex-wrap gap-3">
          <DialogWrapper title="중요한 선택" closeOnBackdropClick={false}>
            <p className="text-body">
              배경을 클릭해도 닫히지 않습니다.
              <br />
              반드시 버튼을 선택해주세요.
            </p>
          </DialogWrapper>

          <DialogWrapper title="필수 확인" closeOnEscape={false}>
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
    closeOnBackdropClick: true,
    closeOnEscape: true,
  },
};
