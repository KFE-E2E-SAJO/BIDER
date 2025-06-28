'use client';

import * as React from 'react';
import { Toaster as Sonner, ToasterProps, toast } from 'sonner';

type Position =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center';

interface CustomToasterProps extends ToasterProps {
  toastClassName?: string;
  titleClassName?: string;
  position?: Position;
  duration?: number;
  render?: ToasterProps['toastOptions'] extends { render: infer T } ? T : never;
}

const Toast = React.forwardRef<HTMLDivElement, CustomToasterProps>(
  (
    {
      toastClassName = '!w-full !flex !justify-center !rounded-lg !bg-neutral-900',
      titleClassName = '!text-body !font-extrabold !text-neutral-0',
      position = 'bottom-center',
      duration = 2000,
      render,
      ...props
    },
    ref
  ) => {
    return (
      <Sonner
        ref={ref}
        position={position}
        duration={duration}
        toastOptions={{
          classNames: {
            toast: toastClassName,
            title: titleClassName,
          },
          ...(render ? { render } : {}),
        }}
        {...props}
      />
    );
  }
);

export { Toast, toast };
