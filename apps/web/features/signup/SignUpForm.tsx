'use client';
import { Button } from '@repo/ui/components/Button/Button';
import '@repo/ui/styles.css';
import { EmailField } from './ui/EmailField';
import { PasswordField } from './ui/PasswordField';
import { ConfirmPasswordField } from './ui/ConfirmPassword';
import { NicknameField } from './ui/NicknameField';
import { useSignUpForm } from './model/useSignupForm';

export const SignUpForm = () => {
  const {
    email,
    domain,
    customDomain,
    password,
    confirmPassword,
    nickname,

    setEmail,
    setDomain,
    setCustomDomain,
    setPassword,
    setConfirmPassword,
    setNickname,

    isLoading,
    isEmailVerified,
    isEmailSent,

    sendVerificationEmail,
    handleSubmitForm,
  } = useSignUpForm();

  return (
    <form onSubmit={handleSubmitForm} className="space-y-6">
      <EmailField
        email={email}
        domain={domain}
        customDomain={customDomain}
        isEmailVerified={isEmailVerified}
        isEmailSent={isEmailSent}
        isLoading={isLoading}
        emailError=""
        domainError=""
        onChangeEmail={setEmail}
        onChangeDomain={setDomain}
        onChangeCustomDomain={setCustomDomain}
        onClickSendVerification={sendVerificationEmail}
      />

      <PasswordField password={password} passwordError="" onChangePassword={setPassword} />

      <ConfirmPasswordField
        confirmPassword={confirmPassword}
        confirmPasswordError=""
        onChangeConfirmPassword={setConfirmPassword}
      />

      <NicknameField nickname={nickname} nicknameError="" onChangeNickname={setNickname} />

      {/* <div className="solid space-y-3">
        <label className="typo-body-bold block text-neutral-800">약관동의</label>

        <div className="flex flex-col border border-neutral-400 pb-5 pl-6 pt-5">
          <Base>전체 동의</Base>
          <hr className="mb-5 mr-5 mt-5 border-neutral-400"></hr>

          <div className="flex flex-col gap-5">
            <Base>이용약관 동의 (필수)</Base>
            <Base>개인정보 수집 및 이용 동의 (필수)</Base>
            <Base>마케팅 정보 수신 동의 (선택)</Base>
            <Base>이벤트 및 혜택 알림 동의 (선택)</Base>
          </div>
        </div>
      </div> */}

      <Button
        type="submit"
        className="bg-main hover:bg-main-dark text-neutral-0 mt-8 w-full py-3 disabled:cursor-not-allowed disabled:bg-neutral-400"
        disabled={isLoading || !isEmailVerified}
      >
        {isLoading ? '처리 중...' : '회원가입'}
      </Button>
    </form>
  );
};
