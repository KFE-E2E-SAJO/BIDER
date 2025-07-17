import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'data-[state=checked]:bg-main peer inline-flex h-[29px] w-[50px] shrink-0 items-center rounded-full border border-transparent outline-none transition-all data-[state=unchecked]:bg-neutral-300',
        'disabled:data-[state=checked]:bg-main-lighter disabled:cursor-not-allowed disabled:data-[state=unchecked]:bg-neutral-100',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'bg-neutral-0 pointer-events-none block size-[21px] rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(120%)] data-[state=unchecked]:translate-x-[3px] disabled:data-[state=unchecked]:bg-neutral-300'
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
