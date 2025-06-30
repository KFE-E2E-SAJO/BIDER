import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-subtitle-small font-semibold transition-all disabled:pointer-events-none disabled:bg-neutral-300 disabled:text-neutral-600 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive rounded-sm cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-main text-neutral-0',
        destructive:
          'bg-destructive text-neutral-0 shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border border-main text-main bg-neutral-0 shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-main-lightest text-main shadow-xs border border-main hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'underline-offset-3 underline text-body font-medium',
        loading: 'bg-main-lighter text-main disabled:bg-main-lighter disabled:text-main',
        muted: 'border border-neutral-300 text-neutral-700',
      },
      size: {
        default: 'w-full h-13 px-4 py-2 has-[>svg]:px-3',
        lg: 'w-43 h-13 gap-1.5 px-6 has-[>svg]:px-4',
        sm: 'w-28 h-9 gap-1.5 px-3 has-[>svg]:px-2.5 text-caption font-normal',
        icon: 'size-15',
        thin: 'w-full h-10 px-4 py-2 has-[>svg]:px-3 text-body font-medium',
        fit: 'w-fit',
      },
      shape: {
        rounded: 'rounded-full h-11 px-6 has-[>svg]:pl-3 has-[>svg]:pr-4 font-normal',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  shape,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, shape, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
