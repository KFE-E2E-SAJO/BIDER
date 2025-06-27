import * as React from 'react';
import { cn } from '@/lib/utils';
import { XIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  status?: 'default' | 'focus' | 'typing' | 'error' | 'disabled';
  type?: 'text' | 'id' | 'email' | 'password';
  label?: string;
  required?: boolean;
  writeText?: React.ReactNode;
  icon?: React.ReactNode;
  errorMessage?: string;
  className?: string;
  showClearButton?: boolean;
}

const InputContent = React.forwardRef<HTMLInputElement, InputProps>(
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
      showClearButton = true,
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

    const handleClear = () => {
      setInputValue('');
      const event = {
        target: { value: '' },
        currentTarget: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(event);
    };

    const showClear =
      showClearButton &&
      !disabled &&
      status !== 'disabled' &&
      (inputValue?.toString().length > 0 || (typeof value === 'string' && value.length > 0));

    const getInputStyles = () => {
      const baseStyles = cn(
        'placeholder:text-muted-foreground dark:bg-input/30',
        'border-[var(--color-line)] flex h-13 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 text-base shadow-xs',
        'transition-[color,box-shadow] outline-none',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
      );

      if (disabled || status === 'disabled') {
        return cn(
          baseStyles,
          'border-[var(--color-disabled)] bg-[var(--color-background)] text-[var(--color-placeholder)]'
        );
      }

      if (status === 'error') {
        return cn(
          baseStyles,
          'border-[var(--color-danger)] focus-visible:border-[var(--color-danger)]',
          'focus-visible:shadow-[0_0_0_1px_var(--color-danger)] focus-visible:shadow-opacity-20',
          'aria-invalid:border-[var(--color-danger)]'
        );
      }

      if (status === 'typing' || isFocused) {
        return cn(
          baseStyles,
          'focus-visible:border-[var(--color-main)]',
          'focus-visible:shadow-[0_0_0_1px_var(--color-main)] focus-visible:shadow-opacity-30'
        );
      }

      return cn(baseStyles);
    };

    return (
      <div className={cn('flex w-full flex-col gap-2', className)}>
        {label && (
          <label
            htmlFor={props.id}
            className="text-[0.8125rem] font-normal capitalize leading-8"
            style={{ color: 'var(--color-title)' }}
          >
            {label}
            {required && (
              <span className="ml-1" style={{ color: 'var(--color-danger)' }}>
                *
              </span>
            )}
          </label>
        )}

        {writeText && (
          <div className="text-sm" style={{ color: 'var(--color-sub-body)' }}>
            {writeText}
          </div>
        )}

        <div className="relative">
          {icon && (
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-placeholder)' }}
            >
              {icon}
            </div>
          )}

          <input
            type={type}
            data-slot="input"
            className={cn(getInputStyles(), icon && 'pl-10', showClear && 'pr-10')}
            ref={ref}
            disabled={disabled}
            value={value !== undefined ? value : inputValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={status === 'error'}
            {...props}
          />

          {showClear && (
            <button
              type="button"
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2',
                'flex h-4 w-4 items-center justify-center rounded-full',
                'transition-colors hover:bg-[var(--color-background)]',
                'focus:outline-none focus:ring-1 focus:ring-[var(--color-main)]'
              )}
              onClick={handleClear}
              tabIndex={-1}
              style={{ color: 'var(--color-placeholder)' }}
            >
              <XIcon size={12} />
            </button>
          )}
        </div>

        {status === 'error' && errorMessage && (
          <p className="text-sm" style={{ color: 'var(--color-danger)' }}>
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

InputContent.displayName = 'InputContent';

export { InputContent };
export type { InputProps };
