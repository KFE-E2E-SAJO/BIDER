import { z } from 'zod';

export const EmailDomainSchema = z.object({
  email: z.string(),
  domain: z.string(),
  customDomain: z.string().optional(),
});

export const validateFullEmail = (values: {
  email: string;
  domain: string;
  customDomain?: string;
  options?: { strictCustomDomainCheck?: boolean };
}): { success: boolean; error?: string; fullEmail?: string } => {
  const { email, domain, customDomain } = values;

  // 기본 형식 체크
  if (!email || typeof email !== 'string') {
    return { success: false, error: '이메일을 다시 입력해주세요' };
  }
  if (!domain || typeof domain !== 'string') {
    return { success: false, error: '도메인을 선택해주세요' };
  }

  let fullEmail: string;

  //커스텀 도메인 처리
  if (domain === 'custom') {
    if (!customDomain || typeof customDomain !== 'string') {
      return { success: false, error: '도메인을 직접 입력해주세요' };
    }
    if (
      customDomain.startsWith('-') ||
      customDomain.endsWith('-') ||
      customDomain.includes('..') ||
      !customDomain.includes('.')
    ) {
      return { success: false, error: '올바른 도메인 형식이 아닙니다' };
    }
    fullEmail = `${email}@${customDomain}`;
  } else {
    fullEmail = `${email}@${domain}`;
  }

  //전체 길이 제한
  if (fullEmail.length > 254) {
    return { success: false, error: '이메일이 너무 깁니다' };
  }

  //로컬 파트 검증
  if (email.indexOf('@') !== -1 || email.length < 1 || email.length > 64) {
    return { success: false, error: '올바른 이메일 형식이 아닙니다' };
  }
  if (email.startsWith('.') || email.endsWith('.') || email.includes('..')) {
    return { success: false, error: '올바른 이메일 형식이 아닙니다' };
  }

  //전체 이메일 정규식 검사
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(fullEmail)) {
    return { success: false, error: '올바른 이메일 형식이 아닙니다' };
  }

  // 성공
  return { success: true, fullEmail };
};
