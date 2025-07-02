import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, '비밀번호는 8자 이상이어야 합니다')
  .max(20, '비밀번호는 20자 이하여야 합니다')
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
      message: '비밀번호는 영문 대/소문자, 숫자, 특수문자 중 2가지 이상을 포함해야 합니다',
    }
  );
