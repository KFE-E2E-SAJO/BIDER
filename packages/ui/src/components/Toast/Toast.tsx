import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

export function Toaster(props: ToasterProps) {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      position="top-center" // 위치를 이미지처럼 상단 가운데로!
      className="toaster group"
      toastOptions={{
        className:
          'bg-neutral-700 text-white rounded-lg py-3 px-4 text-center w-[320px] max-w-[90vw]',
        style: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        },
      }}
      {...props}
    />
  );
}
