import React, { ComponentType, SVGProps } from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  Icon?: ComponentType<SVGProps<SVGSVGElement>>;
  children?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string; // 접근성 지원: 아이콘만 있는 버튼에 aria-label 필수
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  disabled = false,
  Icon,
  children,
  onClick,
  type = 'button',
  ariaLabel,
  className = '',
  ...props
}) => {
  // 버튼 타입 결정: 아이콘만 / 텍스트만 / 아이콘+텍스트
  const isIconOnly = Icon && !children;
  const hasIcon = !!Icon;
  const hasText = !!children;

  // 기본 스타일
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-[var(--color-main)] focus:ring-offset-2
    disabled:cursor-not-allowed
    rounded-[3px]
    text-[16px]
  `;

  // 패딩 스타일 (아이콘만 있는 버튼 vs 일반 버튼)
  const paddingStyles = isIconOnly
    ? 'p-[20px]'
    : hasIcon && hasText
      ? 'py-[15px] pl-[12px] pr-[16px]'
      : 'py-[15px] px-[16px]'; // 텍스트만

  // 아이콘과 텍스트 간격
  const gapStyles = hasIcon && hasText ? 'gap-[6px]' : '';

  // 변형별 스타일
  const variantStyles = {
    primary: {
      enabled: `
        bg-[var(--color-main)] text-white
        hover:bg-[var(--color-main-text)]
        active:bg-[var(--color-main-text)]
      `,
      disabled: `
        bg-[var(--color-disabled)] text-[var(--color-placeholder)]
      `,
    },
    secondary: {
      enabled: `
        bg-white border border-[var(--color-main)] text-[var(--color-main)]
        hover:bg-[var(--color-main-lightest)]
        active:bg-[var(--color-main-lighter)]
      `,
      disabled: `
        bg-white border border-[var(--color-disabled)] text-[var(--color-disabled)]
      `,
    },
    ghost: {
      enabled: `
        bg-transparent text-[var(--color-main)]
        hover:bg-[var(--color-main-lightest)]
        active:bg-[var(--color-main-lighter)]
      `,
      disabled: `
        bg-transparent text-[var(--color-disabled)]
      `,
    },
  };

  // 현재 상태에 따른 스타일 선택
  const currentVariantStyle = disabled
    ? variantStyles[variant].disabled
    : variantStyles[variant].enabled;

  // 최종 클래스명 조합
  const buttonClass = `
    ${baseStyles}
    ${paddingStyles}
    ${gapStyles}
    ${currentVariantStyle}
    ${className}
  `
    .replace(/\s+/g, ' ')
    .trim();

  // 클릭 핸들러
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  // 접근성 검증 (아이콘만 있는 버튼은 ariaLabel 필수)
  if (isIconOnly && !ariaLabel) {
    console.warn('Button: 아이콘만 있는 버튼에는 ariaLabel이 필요합니다.');
  }

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled}
      onClick={handleClick}
      aria-label={ariaLabel}
      {...props}
    >
      {/* 아이콘 렌더링 */}
      {Icon && <Icon width={16} height={16} className="flex-shrink-0" />}

      {/* 텍스트 렌더링 */}
      {children && <span className="flex-shrink-0">{children}</span>}
    </button>
  );
};

export default Button;
