'use client';
import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  onCancel?: () => void;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  ariaLabel?: string;
  className?: string;
  showCloseButton?: boolean;
}

const DialogRoot = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-black/50',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          'fixed bottom-0 left-0 right-0 w-full rounded-t-3xl',
          'sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-1/2 sm:w-auto sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg',
          'p-box z-50 grid gap-4 bg-white pb-[40px] shadow-lg duration-200',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:translate-y-full data-[state=open]:translate-y-0',
          'sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95 pt-5',
          className
        )}
        {...props}
      >
        {showCloseButton && (
          <DialogClose className="relative z-10 flex justify-end rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none">
            <XIcon className="h-9 w-9 cursor-pointer" strokeWidth={1} />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description className={cn('text-sm text-gray-500', className)} {...props} />
  );
}

const Dialog: React.FC<DialogProps> = ({
  open = false,
  onOpenChange,
  title,
  description,
  children,
  onCancel,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  ariaLabel,
  className,
  showCloseButton = true,
}) => {
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && onCancel) onCancel();
    onOpenChange(nextOpen);
  };

  const descriptionId = description
    ? `dialog-description-${Math.random().toString(36).substr(2, 9)}`
    : undefined;

  return (
    <DialogRoot open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={className}
        aria-label={ariaLabel || (typeof title === 'string' ? title : undefined)}
        aria-describedby={descriptionId || undefined} // 경고 해결: 명시적으로 설정
        showCloseButton={showCloseButton}
        onInteractOutside={(event) => {
          if (!closeOnBackdropClick) event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          if (!closeOnEscape) event.preventDefault();
        }}
      >
        {title && (
          <DialogTitle
            className={cn(
              'mb-4 whitespace-pre-line text-center text-lg font-semibold leading-none tracking-tight sm:text-left',
              showCloseButton ? 'px-8 pt-8 sm:px-0 sm:pt-0' : 'pt-2'
            )}
          >
            {title}
          </DialogTitle>
        )}

        {description && (
          <DialogDescription id={descriptionId} className="mb-4">
            {description}
          </DialogDescription>
        )}

        <div className="mb-6 text-center sm:text-left">{children}</div>
      </DialogContent>
    </DialogRoot>
  );
};

export {
  Dialog,
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogOverlay,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
