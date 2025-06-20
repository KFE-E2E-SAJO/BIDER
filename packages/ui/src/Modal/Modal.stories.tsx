import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button/Button.jsx';
import { Modal, type ModalProps } from './Modal.js';
// React Icons 예시
import { FiAlertTriangle, FiCheckCircle, FiClock, FiHeart, FiMapPin, FiStar } from 'react-icons/fi';

// 🔧 Modal을 제어하는 Wrapper 컴포넌트
interface ModalWrapperProps extends Omit<ModalProps, 'isOpen' | 'onClose'> {
  children: React.ReactNode;
}

const ModalWrapper = ({ children, ...modalProps }: ModalWrapperProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>모달 열기</Button>
      <Modal {...modalProps} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {children}
      </Modal>
    </>
  );
};

const meta = {
  title: 'Components/Modal',
  component: ModalWrapper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## 바텀 Modal 컴포넌트

지역기반 중고거래 경매 모바일 웹앱에 최적화된 바텀 모달 컴포넌트입니다.

### 🎯 설계 원칙
- **단일 책임 원칙**: 사용자 확인/선택만 담당
- **의존성 최소화**: Button 컴포넌트 재사용, react-icons만 추가 의존
- **아토믹 디자인**: Organism 레벨 (Button + 레이아웃 조합)

### 📱 바텀 모달 특징
- **크기**: 310px 고정 너비
- **패딩**: 상단 30px, 하단 35px, 좌우 25px
- **모서리**: 18px 둥근 모서리 (상단만)
- **그림자**: 3px 3px 15px rgba(0,0,0,0.1)
- **애니메이션**: 아래에서 위로 슬라이드업

### 🔧 주요 기능
- **2가지 버튼 레이아웃**: 가로/세로 배치
- **접근성**: ESC 키, 배경 클릭 닫기, 포커스 관리
- **커스터마이징**: 제목, 버튼 텍스트, 레이아웃 옵션

### 🛍️ 경매 앱 사용 시나리오
각 스토리는 실제 경매 앱에서 사용될 수 있는 모달 예시들입니다.
        `,
      },
    },
  },
  tags: ['autodocs'],
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
} satisfies Meta<typeof ModalWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AuctionSuccess: Story = {
  args: {
    title: '입찰에 성공하였습니다!',
    confirmText: '결제하러 가기',
    buttonLayout: 'vertical',
    children: (
      <div className="space-y-4">
        <p className="text-body">
          3시간 이내에 결제를 완료해주세요.
          <br />
          시간 내 결제가 없을 경우,
          <br />
          다른 분께 입찰 기회가 넘어갑니다.
        </p>
        <div className="flex items-center justify-center gap-2 text-[var(--color-main)]">
          <FiClock width={16} height={16} />
          <span className="text-caption">남은 시간 2:58:31</span>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '📱 첫 번째 이미지와 동일한 모달: 입찰 성공 후 결제 안내',
      },
    },
  },
};

export const FavoriteStore: Story = {
  args: {
    title: '',
    confirmText: '즐겨찾기하고 쿠폰 받기',
    cancelText: '취소',
    buttonLayout: 'vertical',
    children: (
      <div className="space-y-2">
        <p className="text-body">
          사조님의 상점을 즐겨찾기하면 쿠폰을
          <br />
          드려요! 지금 즐겨찾기하고 쿠폰을 받
          <br />
          으시겠어요?
        </p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '📱 두 번째 이미지와 동일한 모달: 상점 즐겨찾기 쿠폰 안내',
      },
    },
  },
};

export const HorizontalButtons: Story = {
  args: {
    title: '로그아웃 하시겠습니까?',
    confirmText: '로그아웃',
    cancelText: '취소',
    buttonLayout: 'horizontal',
    children: <p className="text-body">현재 세션이 종료되며 다시 로그인해야 합니다.</p>,
  },
  parameters: {
    docs: {
      description: {
        story: '🔧 가로 버튼 레이아웃: 동일한 중요도의 선택지',
      },
    },
  },
};

export const VerticalButtons: Story = {
  args: {
    title: '계정을 삭제하시겠습니까?',
    confirmText: '계정 영구 삭제',
    cancelText: '취소',
    buttonLayout: 'vertical',
    children: (
      <div className="space-y-3">
        <div className="flex items-start justify-center gap-3">
          <FiAlertTriangle className="mt-1 text-[24px] text-[var(--color-danger)]" />
          <div>
            <p className="text-body">
              삭제된 계정은 복구할 수 없습니다.
              <br />
              모든 데이터가 영구적으로 삭제됩니다.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '🔧 세로 버튼 레이아웃: 주요 액션 강조 및 신중한 선택 유도',
      },
    },
  },
};

export const NoButtons: Story = {
  args: {
    title: '알림',
    hideActions: true,
    children: (
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <FiCheckCircle className="text-[24px] text-[var(--color-danger)]" />
          <p className="text-body">설정이 저장되었습니다!</p>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '🔧 버튼 없는 모달: 단순 알림용, X 버튼으로만 닫기',
      },
    },
  },
};

// === 🛍️ 경매 앱 실제 사용 예시 ===

export const AuctionScenarios: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-h3 mb-3">💰 경매 관련 모달들</h3>
        <div className="flex flex-wrap gap-3">
          {/* 입찰 확인 */}
          <ModalWrapper
            title="입찰 확인"
            confirmText="입찰하기"
            cancelText="취소"
            buttonLayout="horizontal"
          >
            <div className="space-y-3">
              <div className="rounded-lg bg-[var(--color-background)] p-3">
                <p className="text-caption mb-1 text-[var(--color-sub-body)]">입찰 금액</p>
                <p className="text-h3 text-[var(--color-main)]">50,000원</p>
              </div>
              <p className="text-caption text-[var(--color-sub-body)]">
                입찰 후에는 취소할 수 없습니다.
              </p>
            </div>
          </ModalWrapper>

          {/* 경매 마감 임박 */}
          <ModalWrapper
            title="경매 마감 임박!"
            confirmText="지금 입찰하기"
            cancelText="나중에"
            buttonLayout="vertical"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-[var(--color-warning)]">
                <FiClock className="text-[24px]" />
                <span className="text-body font-medium">3분 남음</span>
              </div>
              <p className="text-body">
                마지막 기회입니다!
                <br />
                지금 입찰하지 않으면 놓칠 수 있어요.
              </p>
            </div>
          </ModalWrapper>

          {/* 관심 상품 등록 */}
          <ModalWrapper
            title="관심 상품으로 등록할까요?"
            confirmText="관심 상품 등록"
            cancelText="나중에"
            buttonLayout="vertical"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <FiHeart className="text-[24px] text-[var(--color-danger)]" />
              </div>
              <p className="text-body">
                가격 변동이나 경매 시작 시
                <br />
                알림을 받을 수 있어요.
              </p>
            </div>
          </ModalWrapper>
        </div>
      </div>

      <div>
        <h3 className="text-h3 mb-3">📍 위치/권한 관련 모달들</h3>
        <div className="flex flex-wrap gap-3">
          {/* 위치 권한 요청 */}
          <ModalWrapper
            title="위치 권한이 필요합니다"
            confirmText="권한 허용"
            cancelText="나중에"
            buttonLayout="vertical"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <FiMapPin className="text-[24px] text-[var(--color-main)]" />
              </div>
              <div>
                <p className="text-body mb-2">
                  주변 경매 정보를 제공하기 위해
                  <br />
                  위치 권한이 필요합니다.
                </p>
                <ul className="text-caption space-y-1 text-[var(--color-sub-body)]">
                  <li>• 내 주변 경매 찾기</li>
                  <li>• 거리 기반 배송비 계산</li>
                  <li>• 지역별 인기 상품 추천</li>
                </ul>
              </div>
            </div>
          </ModalWrapper>

          {/* 상점 평가 */}
          <ModalWrapper
            title="거래가 완료되었나요?"
            confirmText="평가하기"
            cancelText="나중에"
            buttonLayout="vertical"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((_star, idx) => (
                  <FiStar key={idx} className="text-[24px] text-[var(--color-warning)]" />
                ))}
              </div>
              <p className="text-body">
                판매자에 대한 평가를 남겨주세요.
                <br />
                다른 구매자들에게 도움이 됩니다.
              </p>
            </div>
          </ModalWrapper>
        </div>
      </div>
    </div>
  ),
  args: {
    children: '경매 앱 시나리오 예시들',
    title: '경매 앱 모달들',
    confirmText: '확인',
    cancelText: '취소',
  },
  parameters: {
    docs: {
      description: {
        story: '🛍️ 실제 경매 앱에서 사용될 수 있는 다양한 모달 시나리오들입니다.',
      },
    },
  },
};

export const InteractionOptions: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-h3 mb-3">🔧 상호작용 옵션 테스트</h3>
        <div className="flex flex-wrap gap-3">
          {/* 배경 클릭 비활성화 */}
          <ModalWrapper
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
          </ModalWrapper>

          {/* ESC 키 비활성화 */}
          <ModalWrapper
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
          </ModalWrapper>
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
  parameters: {
    docs: {
      description: {
        story: '🔧 다양한 상호작용 옵션들을 테스트할 수 있습니다.',
      },
    },
  },
};

export const AccessibilityTest: Story = {
  args: {
    title: '접근성 테스트',
    confirmText: '확인',
    cancelText: '취소',
    ariaLabel: '접근성 테스트 모달',
    children: (
      <div className="space-y-4">
        <p className="text-body">이 모달은 접근성을 고려하여 설계되었습니다.</p>
        <ul className="text-caption space-y-1 text-left">
          <li>• Tab 키로 요소 간 이동 가능</li>
          <li>• ESC 키로 모달 닫기</li>
          <li>• 스크린 리더 지원</li>
          <li>• 모달 열림 시 자동 포커스</li>
          <li>• 배경 스크롤 방지</li>
        </ul>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '♿ 키보드 네비게이션과 스크린 리더 지원을 테스트할 수 있습니다.',
      },
    },
  },
};

// 컴포넌트로 분리
const InteractiveModal = () => {
  const [result, setResult] = useState('');

  return (
    <div className="space-y-4">
      <ModalWrapper
        title="인터랙티브 테스트"
        confirmText="확인"
        cancelText="취소"
        onConfirm={() => setResult('✅ 확인 버튼이 클릭되었습니다!')}
        onCancel={() => setResult('❌ 취소 버튼이 클릭되었습니다!')}
      >
        <p className="text-body">
          버튼을 클릭하여 모달의 동작을 테스트해보세요.
          <br />
          결과가 아래에 표시됩니다.
        </p>
      </ModalWrapper>

      {result && (
        <div className="rounded-lg bg-[var(--color-main-lightest)] p-4">
          <p className="text-body text-[var(--color-main-text)]">{result}</p>
        </div>
      )}
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveModal />, // 컴포넌트 사용
  args: {
    children: '인터랙티브 테스트 내용',
    title: '인터랙티브 테스트',
    confirmText: '확인',
    cancelText: '취소',
  },
  parameters: {
    docs: {
      description: {
        story: '🔧 실제로 상호작용해볼 수 있는 인터랙티브 모달입니다.',
      },
    },
  },
};
