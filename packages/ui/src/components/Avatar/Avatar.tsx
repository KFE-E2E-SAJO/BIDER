import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import AvatarFallbackIcon from '../Icon/AvatarFallbakIcon';

import { cn } from '@/lib/utils';

interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  src?: string;
  alt?: string;
  name?: string;
}

function Avatar({ className, src, alt = 'profile' }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn('relative flex shrink-0 overflow-hidden rounded-full', className)}
    >
      {src ? (
        <AvatarPrimitive.Image src={src} alt={alt} className="aspect-square size-full" />
      ) : (
        <AvatarPrimitive.Fallback className="bg-muted flex size-full items-center justify-center">
          <AvatarFallbackIcon />
        </AvatarPrimitive.Fallback>
      )}
    </AvatarPrimitive.Root>
  );
}

export { Avatar };
