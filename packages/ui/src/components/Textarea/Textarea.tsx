'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textareaVariants = cva('w-full focus:outline-none resize-none custom-scrollbar', {
  variants: {
    variant: {
      form: 'bg-neutral-0 border border-neutral-400 rounded-[3px] px-[15px] py-[10px] placeholder:text-neutral-600 focus:border-main focus:ring-0',
      chat: 'bg-neutral-050 placeholder:text-neutral-400 disabled:bg-neutral-300 rounded-[10px] pl-[17px] py-[9px]',
    },
  },
  defaultVariants: {
    variant: 'form',
  },
});

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  maxRows?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = 'form', maxRows = 8, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useImperativeHandle(ref, () => textareaRef.current!);

    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea || variant !== 'chat') return;

      textarea.style.height = 'auto';

      const lineHeight = 21; // typo-body-regular 기준
      const padding = 18; // py-[9px] = 상하 9px씩
      const minHeight = lineHeight + padding; // 1줄 높이
      const maxHeight = lineHeight * maxRows + padding; // 최대 8줄 높이

      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);

      textarea.style.height = `${newHeight}px`;
    }, [variant, maxRows]);

    React.useEffect(() => {
      adjustHeight();
    }, [props.value, adjustHeight]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      props.onChange?.(e);
      setTimeout(adjustHeight, 0);
    };

    return (
      <textarea
        ref={textareaRef}
        data-slot="textarea"
        className={cn(textareaVariants({ variant, className }))}
        rows={variant === 'chat' ? 1 : undefined}
        {...props}
        onChange={handleChange}
      />
    );
  }
);
