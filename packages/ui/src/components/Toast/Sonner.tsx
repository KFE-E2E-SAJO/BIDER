'use client';

import { Toaster as Sonner, ToasterProps, toast } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      toastOptions={{
        classNames: {
          toast: '!w-full !flex !justify-center !rounded-lg !bg-neutral-900',
          title: '!text-body !font-extrabold !text-neutral-0',
        },
      }}
      position="bottom-center"
      {...props}
    />
  );
};

export { Toaster, toast };
