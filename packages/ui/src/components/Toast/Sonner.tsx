import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps, toast } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster-custom"
      toastOptions={{
        className:
          'toaster-custom !rounded-lg !bg-neutral-900 !px-4 !py-3 !text-center !text-base !font-medium !text-white !shadow-lg',
      }}
      position="bottom-center"
      {...props}
    />
  );
};

export { Toaster, toast };
