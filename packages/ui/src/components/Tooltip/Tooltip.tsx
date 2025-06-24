import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface MobileTooltipProps extends React.ComponentProps<typeof TooltipPrimitive.Root> {
  defaultOpen?: boolean;
}

interface TooltipContentProps extends React.ComponentProps<typeof TooltipPrimitive.Content> {
  onClose?: () => void;
  showCloseButton?: boolean;
}

function TooltipProvider({
  delayDuration = 0,
  skipDelayDuration = 0,
  disableHoverableContent = true,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      disableHoverableContent={disableHoverableContent}
      {...props}
    />
  );
}

function Tooltip({ defaultOpen = true, children, ...props }: MobileTooltipProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" open={open} onOpenChange={setOpen} {...props}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === TooltipContent) {
            return React.cloneElement(child, {
              onClose: () => setOpen(false),
              ...(child.props as any),
            });
          }
          return child;
        })}
      </TooltipPrimitive.Root>
    </TooltipProvider>
  );
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      onPointerEnter={(e) => e.preventDefault()}
      onPointerLeave={(e) => e.preventDefault()}
      onFocus={(e) => e.preventDefault()}
      onBlur={(e) => e.preventDefault()}
      {...props}
    />
  );
}

function TooltipContent({
  className,
  sideOffset = 10,
  children,
  onClose,
  showCloseButton = true,
  ...props
}: TooltipContentProps) {
  const handleClose = (e?: any) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    console.log('handleClose 호출됨', onClose); // 디버깅용
    onClose?.();
  };

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        side="bottom"
        align="start"
        className={cn(
          'typo-caption text-neutral-0 text-balance rounded-[3px] bg-neutral-800 py-[5px] pl-[11px] pr-[5px]',
          'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]',
          'relative flex items-center',
          className
        )}
        onPointerEnter={(e) => e.preventDefault()}
        onPointerLeave={(e) => e.preventDefault()}
        onPointerDownOutside={handleClose}
        {...props}
      >
        {children}
        {showCloseButton && (
          <button className="cursor-pointer" onClick={handleClose} aria-label="툴팁 닫기">
            <X size={18} className="pl-[2px]" />
          </button>
        )}
        <TooltipPrimitive.Arrow className="absolute left-[-5px] top-[-1px] z-50 size-2.5 rounded-[2px] fill-neutral-800" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
