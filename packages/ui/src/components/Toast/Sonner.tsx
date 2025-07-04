import { Fragment } from 'react/jsx-runtime';
import { toast as sonnerToast, Toaster as Sonner, ToasterProps } from 'sonner';

export interface CustomToastOptions {
  content: string;
  duration?: number;
}

const toast = ({ content, duration = 3000 }: CustomToastOptions) => {
  sonnerToast.custom(
    () => (
      <div className={`flex items-center justify-center gap-2 rounded-[5px] bg-neutral-900`}>
        {/* Content */}
        <div className="typo-caption-medium text-neutral-0 w-[95vw] max-w-[500px] flex-grow break-words p-[11px] text-center">
          {content.split('\n').map((line, index) => (
            <Fragment key={index}>
              {line}
              {index < content.split('\n').length - 1 && <br />}
            </Fragment>
          ))}
        </div>
      </div>
    ),
    {
      duration,
      className: 'custom-toast',
    }
  );
};

const Toaster = ({ ...props }: ToasterProps) => {
  return <Sonner className="toaster group" gap={8} {...props} />;
};

export { toast, Toaster };
