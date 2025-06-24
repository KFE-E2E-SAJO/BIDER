import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textareaVariants = cva(
  'resize-none rounded border px-3 py-2 transition-shadow focus:outline-none',
  {
    variants: {
      size: {
        form: 'h-[204px] w-[358px]', // 출품하기 화면용 (높이 고정된 블록)
        chat: 'h-10 min-h-[2.5rem] resize-y', // 채팅 입력창용 (기본 작게, 늘어나도록)
      },
      intent: {
        form: 'bg-white border-line focus:border-main focus:ring-0 text-textarea',
        chat: 'bg-chat-message border-transparent text-[14px] text-line)',
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
  ({ className, size, intent, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(textareaVariants({ size, intent, className }))}
        {...props}
      />
    );
  }
);
