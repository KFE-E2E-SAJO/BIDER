import { User, Mail } from 'lucide-react';

export const FindAccountConfig = (accountType: string) => {
  if (accountType === 'email') {
    return {
      title: '아이디(이메일) 찾기',
      placeholder: '닉네임',
      icon: () => <User />,
      inputType: 'text' as const,
      buttonText: '아이디(이메일) 찾기',
      resultPrefix: '이메일: ',
      description: '보안을 위해 이메일의 일부가 마스킹되었습니다.',
    };
  } else {
    return {
      title: '비밀번호 찾기',
      placeholder: '이메일 주소',
      icon: () => <Mail />,
      inputType: 'text' as const,
      buttonText: '재설정 이메일 발송',
      resultPrefix: '',
      description: '입력하신 이메일로 재설정 링크를 확인해주세요.',
    };
  }
};
