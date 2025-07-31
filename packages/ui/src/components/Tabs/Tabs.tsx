'use client';

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
      className={cn('flex flex-col gap-2 overflow-x-hidden', className)}
      {...props}
    >
      <TabsPrimitive.List
        data-slot="tabs-list"
        className="bg-muted text-muted-foreground scrollbar-none w-full overflow-x-auto"
      >
        <div className="inline-flex min-w-max items-center gap-2 px-4">
          {items.map((item) => (
            <TabsPrimitive.Trigger
              key={item.value}
              value={item.value}
              className={cn(
                'data-[state=active]:text-neutral-0 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-neutral-300 px-3 py-2 text-neutral-700 data-[state=active]:border-neutral-900 data-[state=active]:bg-neutral-900'
              )}
            >
              {item.label}
            </TabsPrimitive.Trigger>
          ))}
        </div>
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
