import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textareaVariants = cva(
  'w-full min-h-[2.5rem] resize-none rounded border px-3 py-2 transition-shadow focus:outline-none',
  {
    variants: {
      variant: {
        form: 'resize-none bg-white border-neutral-400 focus:border-main focus:ring-0 text-body',
        chat: 'resize-none rounded-xl bg-chat-message border-transparent text-body placeholder:text-neutral-400',
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
  ({ className, variant, onInput, ...props }, ref) => {
    const innerRef = React.useRef<HTMLTextAreaElement>(null);
    const [overflowStyle, setOverflowStyle] = React.useState<'hidden' | 'auto' | undefined>(
      'hidden'
    );

    React.useImperativeHandle(ref, () => innerRef.current!);

    const updateOverflowStyle = () => {
      const textarea = innerRef.current;
      if (textarea) {
        if (variant === 'form') {
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + 'px';

          const isFirstLine = textarea.scrollHeight <= textarea.clientHeight + 5;
          const newOverflowStyle = isFirstLine ? 'hidden' : 'auto';
          setOverflowStyle(newOverflowStyle);
        } else if (variant === 'chat') {
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + 'px';
          setOverflowStyle('hidden');
        }
      }
    };

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      updateOverflowStyle();
      if (onInput) onInput(e);
    };

    React.useEffect(() => {
      updateOverflowStyle();
    }, [props.value, variant]);

    const getOverflowStyle = () => {
      if (variant === 'chat') return 'hidden';
      return overflowStyle;
    };

    return (
      <textarea
        ref={innerRef}
        data-slot="textarea"
        className={cn(textareaVariants({ variant, className }))}
        {...props}
        onInput={handleInput}
        rows={1}
        style={{
          overflow: getOverflowStyle(),
          ...(props.style || {}),
        }}
      />
    );
  }
);
