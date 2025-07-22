import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';
import AvatarFallbackIcon from '@/components/Icon/AvatarFallbakIcon';

interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  src?: string;
  alt?: string;
  name?: string;
}

function Avatar({ className, src, alt = 'profile' }: AvatarProps) {
  const isValidSrc = !!src && typeof src === 'string' && src.trim() !== '';

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      key={src ?? 'fallback'}
      className={cn('relative flex shrink-0 overflow-hidden rounded-full', className)}
    >
      {isValidSrc ? (
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
