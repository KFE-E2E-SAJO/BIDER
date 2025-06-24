import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

export type TabItem = {
  value: string;
  label: string;
  content: React.ReactNode;
};

interface CustomTabsProps extends React.ComponentProps<typeof TabsPrimitive.Root> {
  items: TabItem[];
}

function Tabs({ className, items, ...props }: CustomTabsProps) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    >
      <TabsPrimitive.List
        data-slot="tabs-list"
        className="bg-muted text-muted-foreground inline-flex w-fit items-center justify-center gap-2"
      >
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            className={cn(
              `cursor-pointer rounded-full border border-[var(--neutral-300)] px-3 py-2 text-[var(--neutral-700)] data-[state=active]:border-[var(--neutral-900)] data-[state=active]:bg-[var(--neutral-900)] data-[state=active]:text-[var(--neutral-0)]`
            )}
          >
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>

      {items.map((item) => (
        <TabsPrimitive.Content key={item.value} value={item.value} className="flex-1 outline-none">
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}

export { Tabs };
