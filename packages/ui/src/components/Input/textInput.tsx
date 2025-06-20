'use client';

import { useRef, useState } from 'react';
import { cn } from '@/lib/utils.js';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  status?: 'default' | 'focus' | 'typing' | 'error' | 'success' | 'disabled';
  errorMessage?: string;
  icon?: React.ReactNode;
  className?: string; //추가
}

export const TextInput = ({
  label,
  required,
  status = 'default',
  errorMessage,
  icon,
  value,
  disabled,
  className,
  ...props
}: TextInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const getStatus = () => {
    if (disabled)
      return 'border-[var(--color-disabled)] bg-[var(--color-background)] text-[var(--color-line)]';
    if (status === 'error') return 'border-[var(--color-danger)]';
    if (status === 'success') return 'border-[var(--color-line)]';
    if (status === 'typing') return 'border-[var(--color-main)]';
    if (isFocused) return 'border-[var(--color-main)]';
    return 'border-[var(--color-line)]';
  };

  return (
    <div className={cn('flex w-full flex-col gap-1', className)}>
      {label && (
        <label className="text-xs text-[var(--color-placeholder)]">
          {label}
          {required && <span className="ml-0.5 text-[var(--color-danger)]">*</span>}
        </label>
      )}
      <div
        className={`flex items-center rounded-sm border p-2 ${getStatus()} ${disabled ? 'cursor-not-allowed' : ''} `}
      >
        {icon && icon}
        <input
          ref={inputRef}
          type="text"
          className="ml-2 text-sm font-normal text-[var(--color-title)] outline-none placeholder:text-[var(--color-placeholder)] disabled:cursor-not-allowed"
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={value}
          {...props}
        />
      </div>
      {status === 'error' && errorMessage && (
        <p className="text-xs text-[var(--color-danger)]">{errorMessage}</p>
      )}
    </div>
  );
};
