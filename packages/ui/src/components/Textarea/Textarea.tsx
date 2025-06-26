import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textareaVariants = cva(
  // 공통 클래스
  'w-full min-h-[2.5rem] resize-none rounded border px-3 py-2 transition-shadow focus:outline-none',
  {
    variants: {
      variant: {
        form: [
          'bg-white border-neutral-400 focus:border-main focus:ring-0 text-body resize-none',
        ].join(' '),
        chat: [
          'bg-chat-message border-transparent text-body placeholder:text-neutral-400 rounded-xl resize-none',
        ].join(' '),
      },
    },
    defaultVariants: {
      variant: 'form',
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = 'form', onInput, ...props }, ref) => {
    const innerRef = React.useRef<HTMLTextAreaElement>(null);
    const [overflowStyle, setOverflowStyle] = React.useState<'hidden' | 'auto' | undefined>(
      'hidden'
    );

    React.useImperativeHandle(ref, () => innerRef.current!);

    // textarea 높이, overflow 제어
    const updateOverflowStyle = () => {
      const textarea = innerRef.current;
      if (!textarea) return;

      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';

      if (variant === 'form') {
        // form: 첫 줄까지는 스크롤 숨김, 두 번째 줄부터 스크롤 표시
        const isFirstLine = textarea.scrollHeight <= textarea.clientHeight + 5;
        setOverflowStyle(isFirstLine ? 'hidden' : 'auto');
      } else if (variant === 'chat') {
        // chat: 항상 숨김, 자동 높이
        setOverflowStyle('hidden');
      }
    };

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      updateOverflowStyle();
      if (onInput) onInput(e);
    };

    React.useEffect(() => {
      updateOverflowStyle();
    }, [props.value, variant]);

    return (
      <textarea
        ref={innerRef}
        data-slot="textarea"
        className={cn(textareaVariants({ variant, className }))}
        {...props}
        onInput={handleInput}
        rows={1}
        style={{
          overflow: overflowStyle,
          ...(props.style || {}),
        }}
      />
    );
  }
);
