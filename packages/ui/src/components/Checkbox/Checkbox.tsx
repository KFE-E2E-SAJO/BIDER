import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Base } from '@/components/Checkbox/Base';
import { Label } from '@/components/Label/Label';

interface CheckboxProps extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  className?: string;
  id: string;
  label: React.ReactNode;
  labelClassName?: string;
  checkboxClassName?: string;
}

const Checkbox = ({ className, id, label, labelClassName, ...props }: CheckboxProps) => {
  return (
    <div className="flex items-center gap-2">
      <Base id={id} className={className} {...props} />
      <Label className={labelClassName} htmlFor={id}>
        {label}
      </Label>
    </div>
  );
};

export default Checkbox;
