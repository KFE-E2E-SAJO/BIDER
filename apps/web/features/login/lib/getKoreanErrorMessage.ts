export const getKoreanErrorMessage = (errorMessage: string) => {
  if (errorMessage.includes('Invalid login credentials')) {
    return '이메일 또는 비밀번호가 올바르지 않습니다.';
  }
  if (errorMessage.includes('Email not confirmed')) {
    return '이메일 인증을 완료해주세요.';
  }
  if (errorMessage.includes('Too many requests')) {
    return '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
  }
  return '로그인 중 문제가 발생했습니다.';
};
