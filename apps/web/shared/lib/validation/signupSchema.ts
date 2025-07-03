import { z } from 'zod';

// 기본 필드 스키마 정의 (refine 전용)
export const baseSignupSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .max(64, '이메일이 너무 깁니다')
    .regex(/^[a-zA-Z0-9._%+-]+$/, '올바른 이메일 형식이 아닙니다'),
  domain: z.string().min(1, '도메인을 선택해주세요'),
  customDomain: z.string().optional(),

  password: z
    .string()
    .min(8, '비밀번호 8자 이상 입력해주세요')
    .max(20, '비밀번호는 20자 이하로 입력해주세요')
    .refine(
      (val) => {
        const hasLower = /[a-z]/.test(val);
        const hasUpper = /[A-Z]/.test(val);
        const hasNumber = /\d/.test(val);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(val);
        const typeCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
        return typeCount >= 2;
      },
      {
        message: '영문, 숫자, 특수문자 중 2종류 이상 포함해야 합니다',
      }
    ),

  confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),

  nickname: z
    .string()
    .min(2, '2자 이상 입력해주세요')
    .max(10, '10자 이하로 입력해주세요')
    .regex(/^[가-힣a-zA-Z0-9]+$/, '한글, 영문, 숫자만 입력 가능합니다'),
});

// 최종 회원가입용 스키마
export const signupSchema = baseSignupSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  }
);
