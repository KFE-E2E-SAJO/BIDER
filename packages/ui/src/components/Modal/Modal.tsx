'use client';

import React, { useCallback, useEffect } from 'react';
import { FocusTrap } from 'focus-trap-react'; // ★ 추가

import { X } from 'lucide-react';
import { Button } from '@/components/Button/Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  buttonLayout?: 'horizontal' | 'vertical';
  hideActions?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  ariaLabel?: string;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
  buttonLayout = 'horizontal',
  hideActions = false,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  ariaLabel,
  className = '',
  ...props
}) => {
  // 🔧 ESC 키 이벤트 처리
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  // 배경 클릭 시
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  // 확인
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  // 취소
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  // 모달이 열릴 때
  useEffect(() => {
    if (!isOpen) return;

    // body 스크롤 방지
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // ESC 키 이벤트 리스너 등록
    if (closeOnEscape) {
      document.addEventListener('keydown', handleEscape);
    }

    // 기존: 첫 번째 focusable 요소 포커스하는 코드 삭제 (focus-trap이 자동 처리)
    // const modal = document.querySelector('[data-modal="true"]');
    // if (modal) { ... }

    // 클린업
    return () => {
      document.body.style.overflow = originalOverflow;
      if (closeOnEscape) {
        document.removeEventListener('keydown', handleEscape);
      }
    };
  }, [isOpen, closeOnEscape, handleEscape]);

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal-backdrop)] flex items-end justify-center"
      style={{ zIndex: 'var(--z-modal-backdrop)' }}
    >
      {/* 배경 오버레이 */}
      <div
        className="animate-fade-in fixed inset-0 bg-[var(--modal-backdrop)]"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* 바텀 모달 컨테이너 */}
      <FocusTrap
        focusTrapOptions={{
          clickOutsideDeactivates: closeOnBackdropClick, // 백드롭 클릭으로 닫기 허용
          escapeDeactivates: false, // ESC는 별도 onClose 로직으로 직접 제어
          fallbackFocus: '[data-modal="true"]', // 모달이 비어있을 때 포커스 fallback
        }}
      >
        <div
          data-modal="true"
          className={`animate-slide-up relative mx-auto mb-0 w-[310px] bg-white px-[25px] pb-[35px] pt-[30px] ${className} `}
          style={{
            borderRadius: '18px 18px 0px 0px',
            boxShadow: '3px 3px 15px 0px rgba(0, 0, 0, 0.10)',
            zIndex: 'var(--z-modal)',
          }}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel || title}
          {...props}
        >
          {/* 닫기 버튼 (우상단 고정) */}
          <button
            onClick={onClose}
            className="absolute right-[15px] top-[15px] rounded-lg p-2 text-[var(--color-sub-body)] transition-colors duration-200 hover:bg-[var(--color-background)] hover:text-[var(--color-body)] focus:outline-none focus:ring-2 focus:ring-[var(--color-main)] focus:ring-offset-2"
            aria-label="모달 닫기"
          >
            <X width={20} height={20} />
          </button>

          {/* 제목 */}
          {title && (
            <div className="mb-4">
              <h2 className="text-h2 text-center text-[var(--color-title)]">{title}</h2>
            </div>
          )}

          {/* 본문 */}
          <div className="mb-6 text-center">{children}</div>

          {/* 액션 버튼 */}
          {!hideActions && (onConfirm || onCancel) && (
            <div className={buttonLayout === 'vertical' ? 'space-y-3' : 'flex gap-3'}>
              {buttonLayout === 'vertical' ? (
                // 세로 레이아웃 (확인 버튼이 위에)
                <>
                  {onConfirm && (
                    <Button variant="primary" onClick={handleConfirm} className="w-full">
                      {confirmText}
                    </Button>
                  )}

                  {onCancel && (
                    <Button variant="secondary" onClick={handleCancel} className="w-full">
                      {cancelText}
                    </Button>
                  )}
                </>
              ) : (
                // 가로 레이아웃
                <>
                  {onCancel && (
                    <Button variant="secondary" onClick={handleCancel} className="flex-1">
                      {cancelText}
                    </Button>
                  )}

                  {onConfirm && (
                    <Button variant="primary" onClick={handleConfirm} className="flex-1">
                      {confirmText}
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </FocusTrap>
    </div>
  );
};

export default Modal;
