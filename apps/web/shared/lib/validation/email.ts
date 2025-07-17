import { z } from 'zod';

export const EmailDomainSchema = z.object({
  email: z.string(),
  domain: z.string(),
  customDomain: z.string().optional(),
});

export const validateFullEmail = (values: {
  fullEmail: string;
  options?: { strictCustomDomainCheck?: boolean };
}): { success: boolean; error?: string; fullEmail?: string } => {
  const { fullEmail } = values;

  // 기본 형식 체크
  if (!fullEmail || typeof fullEmail !== 'string') {
    return { success: false, error: '이메일을 다시 입력해주세요' };
  }

  //전체 길이 제한
  if (fullEmail.length > 254) {
    return { success: false, error: '이메일이 너무 깁니다' };
  }

  //전체 이메일 정규식 검사
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(fullEmail)) {
    return { success: false, error: '올바른 이메일 형식이 아닙니다' };
  }

  // 성공
  return { success: true, fullEmail };
};
