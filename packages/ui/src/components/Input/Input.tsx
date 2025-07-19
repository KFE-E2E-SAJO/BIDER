import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  status?: 'default' | 'focus' | 'typing' | 'error' | 'disabled';
  type?: 'text' | 'id' | 'email' | 'password' | 'time' | 'date';
  label?: string;
  required?: boolean;
  writeText?: React.ReactNode;
  icon?: React.ReactNode;
  errorMessage?: string;
  inputStyle?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      status = 'default',
      type = 'text',
      label,
      required,
      icon,
      errorMessage,
      writeText,
      className,
      disabled,
      onFocus,
      onBlur,
      onChange,
      value,
      inputStyle,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value || '');

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      onChange?.(e);
    };

    const getInputStyles = () => {
      const baseStyles = cn(
        'placeholder:text-neutral-600 dark:bg-input/30',
        'border-neutral-400 flex h-13 w-full min-w-0 rounded-sm border bg-transparent px-[15px] py-[10px] shadow-xs',
        'transition-[color,box-shadow] outline-none',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
      );

      if (disabled || status === 'disabled') {
        return cn(baseStyles, 'border-neutral-300 bg-neutral-100 text-neutral-600');
      }

      if (status === 'error') {
        return cn(
          baseStyles,
          'border-danger focus-visible:border-danger',
          'focus-visible:ring-1 focus-visible:ring-danger focus-visible:shadow-opacity-20',
          'aria-invalid:border-danger'
        );
      }

      if (status === 'typing' || isFocused) {
        return cn(
          baseStyles,
          'focus-visible:border-main',
          'focus-visible:ring-1 focus-visible:ring-main focus-visible:shadow-opacity-30'
        );
      }

      return cn(baseStyles);
    };

    return (
      <div className={cn('flex w-full flex-col gap-2', className)}>
        {label && (
          <label
            htmlFor={props.id}
            className="leading text-[0.8125rem] font-normal capitalize text-neutral-900"
          >
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </label>
        )}

        {writeText && <div className="text-sm text-neutral-700">{writeText}</div>}

        <div className="relative">
          {icon && (
            <div className="absolute left-[20px] top-1/2 -translate-y-1/2 text-neutral-600">
              {icon}
            </div>
          )}

          <input
            type={type}
            data-slot="input"
            className={cn(getInputStyles(), icon && 'pl-10', inputStyle)}
            ref={ref}
            disabled={disabled}
            value={value !== undefined ? value : inputValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={status === 'error'}
            style={
              type === 'time'
                ? { letterSpacing: '0.35rem', paddingLeft: '1rem' }
                : type === 'date'
                  ? { letterSpacing: '0.16rem', paddingLeft: '1rem', display: 'block' }
                  : {}
            }
            {...props}
          />
        </div>

        {status === 'error' && errorMessage && (
          <p className="text-danger text-sm">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'InputContent';

export { Input };
export type { InputProps };
