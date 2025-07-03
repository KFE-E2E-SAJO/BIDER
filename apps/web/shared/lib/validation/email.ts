import { baseSignupSchema } from './signupSchema';

export const emailSchema = baseSignupSchema
  .pick({
    email: true,
    domain: true,
    customDomain: true,
  })
  .refine(
    (data) => {
      if (data.domain === 'custom') {
        const custom = data.customDomain ?? '';
        if (
          !custom.includes('.') ||
          custom.startsWith('-') ||
          custom.endsWith('-') ||
          custom.includes('..')
        ) {
          return false;
        }
      }
      return true;
    },
    {
      message: '올바른 도메인 형식이 아닙니다',
      path: ['customDomain'],
    }
  );
