'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textareaVariants = cva(
  'w-full resize-none rounded border text-body px-3 py-2 transition-shadow focus:outline-none',
  {
    variants: {
      variant: {
        form: 'bg-white border-neutral-400 focus:border-main focus:ring-0',
        chat: 'bg-[#f6f6f6] border-transparent placeholder:text-neutral-400 rounded-xl',
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

    const updateOverflowStyle = () => {
      const textarea = innerRef.current;
      if (!textarea) return;

      if (variant === 'chat') {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
        setOverflowStyle('hidden');
      } else if (variant === 'form') {
        const hasExternalHeight = props.style?.height || className?.includes('h-');

        if (!hasExternalHeight) {
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + 'px';
        }
        const isFirstLine = textarea.scrollHeight <= textarea.clientHeight + 5;
        setOverflowStyle(isFirstLine ? 'hidden' : 'auto');
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
          ...props.style,
        }}
      />
    );
  }
);
