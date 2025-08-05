import React, { useRef, useEffect, useState } from 'react';

interface SwipeableItemProps {
  children: React.ReactNode;
  onDelete: () => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onDragChange?: (isDragging: boolean) => void;
  btnText: string;
}

const SwipeableItem: React.FC<SwipeableItemProps> = ({
  children,
  onDelete,
  isOpen,
  onOpen,
  onClose,
  onDragChange,
  btnText = '나가기',
}) => {
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const dragState = useRef({
    isDragging: false,
    hasDragged: false,
    startX: 0,
    currentX: 0,
  });

  // 외부에서 isOpen 변경 시 translateX 반영
  useEffect(() => {
    setTranslateX(isOpen ? -78 : 0);
    if (!isOpen) {
      dragState.current.isDragging = false;
      dragState.current.hasDragged = false;
    }
  }, [isOpen]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      dragState.current.isDragging = true;
      dragState.current.startX = touch.clientX;
      dragState.current.currentX = touch.clientX;
      dragState.current.hasDragged = false;
    }
  };

  // 모바일 터치 핸들러
  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch && dragState.current.isDragging) {
      const diff = touch.clientX - dragState.current.startX;

      // ✅ 드래그 시작 감지
      if (!dragState.current.hasDragged && Math.abs(diff) > 5) {
        dragState.current.hasDragged = true;
        onDragChange?.(true); // 외부에 드래그 시작 알림
      }

      if (diff < 0) {
        setTranslateX(Math.max(diff, -80));
      } else {
        setTranslateX(0);
      }
    }
  };

  const handleTouchEnd = () => {
    dragState.current.isDragging = false;

    if (dragState.current.hasDragged) {
      setTimeout(() => {
        onDragChange?.(false);
      }, 50);
    }

    dragState.current.hasDragged = false;

    const currentTranslateX = translateX;
    if (currentTranslateX < -40) {
      onOpen();
    } else {
      onClose();
    }
  };

  // PC 마우스 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragState.current.isDragging = true;
    dragState.current.startX = e.clientX;
    dragState.current.currentX = e.clientX;
    dragState.current.hasDragged = false;

    // 🔥 현재 translateX 값을 저장
    let currentTranslateX = translateX;

    const handleMouseMove = (e: MouseEvent) => {
      if (dragState.current.isDragging) {
        const diff = e.clientX - dragState.current.startX;

        if (!dragState.current.hasDragged && Math.abs(diff) > 5) {
          dragState.current.hasDragged = true;
          onDragChange?.(true);
        }

        if (diff < 0) {
          currentTranslateX = Math.max(diff, -80);
          setTranslateX(currentTranslateX);
        } else {
          currentTranslateX = 0;
          setTranslateX(currentTranslateX);
        }
      }
    };

    const handleMouseUp = () => {
      if (dragState.current.isDragging) {
        dragState.current.isDragging = false;
        if (dragState.current.hasDragged) {
          setTimeout(() => {
            onDragChange?.(false);
          }, 50);
        }
        dragState.current.hasDragged = false;

        // 🔥 지역 변수로 저장된 최신 값 사용
        if (currentTranslateX < -40) {
          onOpen();
        } else {
          onClose();
        }
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-white">
      {/* 삭제 버튼: 콘텐츠 아래에 깔려있음 */}
      <div className="bg-danger absolute right-0 top-0 z-0 flex h-full w-[78px] items-center justify-center">
        <button
          onClick={onDelete}
          className="text-neutral-0 typo-caption-medium h-full w-full cursor-pointer"
        >
          {btnText}
        </button>
      </div>

      {/* 콘텐츠 */}
      <div
        className="relative z-10 w-full cursor-grab select-none bg-white active:cursor-grabbing"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: dragState.current.isDragging ? 'none' : 'transform 0.2s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        draggable={false}
      >
        {children}
      </div>
    </div>
  );
};

export default SwipeableItem;
