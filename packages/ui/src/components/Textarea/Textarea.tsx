import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textareaVariants = cva(
  'resize-none rounded border px-3 py-2 transition-shadow focus:outline-none',
  {
    variants: {
      size: {
        form: 'h-[204px] w-[358px] resize-none', // 출품하기 화면용 (높이 고정된 블록)
        chat: 'w-[292px] min-h-[39px] resize-none rounded-xl', // 채팅 입력창용 (기본 작게)
      },
      intent: {
        form: 'bg-white border-neutral-400 focus:border-main focus:ring-0 text-body',
        chat: 'bg-chat-message border-transparent text-body placeholder:text-neutral-400',
      },
    },
    defaultVariants: {
      size: 'form',
      intent: 'form',
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, intent, onInput, ...props }, ref) => {
    // ref를 내부적으로 관리: 외부 ref도 함께 동작하도록
    const innerRef = React.useRef<HTMLTextAreaElement>(null);

    // 외부에서 ref 전달된 경우, 함께 연결
    React.useImperativeHandle(ref, () => innerRef.current!);

    // chat일때만 높이 자동조정
    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      if (size === 'chat') {
        const textarea = innerRef.current;
        if (textarea) {
          textarea.style.height = 'auto'; // 높이 초기화
          textarea.style.height = textarea.scrollHeight + 'px'; // 실제 내용만큼
        }
      }
      // props로 onInput 들어오면 그대로 실행
      if (onInput) onInput(e);
    };

    // chat의 내용 초기화/수정 시 높이 조정(Controlled 지원)
    React.useEffect(() => {
      if (size === 'chat') {
        const textarea = innerRef.current;
        if (textarea) {
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + 'px';
        }
      }
    }, [props.value, size]);

    return (
      <textarea
        ref={innerRef}
        data-slot="textarea"
        className={cn(textareaVariants({ size, intent, className }))}
        {...props}
        onInput={handleInput}
        // chat이면 rows=1, form이면 rows=6
        rows={size === 'chat' ? 1 : 6}
        style={{ overflow: size === 'chat' ? 'hidden' : 'auto', ...props.style }}
      />
    );
  }
);
