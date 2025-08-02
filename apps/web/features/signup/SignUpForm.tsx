'use client';
import { Button } from '@repo/ui/components/Button/Button';
import { EmailField } from './ui/EmailField';
import { PasswordField } from './ui/PasswordField';
import { ConfirmPasswordField } from './ui/ConfirmPassword';
import { NicknameField } from './ui/NicknameField';
import { useSignUpForm } from './model/useSignupForm';
import { EmailVerifiedField } from './ui/EmailVerifiedField';

export const SignUpForm = () => {
  const {
    email,
    domain,
    customDomain,
    verifiedCode,
    password,
    confirmPassword,
    nickname,

    isEmailSent,
    verifiedEmail,
    isEmailVerified,
    isLoading,
    disabled,

    emailError,
    domainError,
    verifiedCodeError,
    passwordError,
    confirmPasswordError,
    nicknameError,

    setEmail,
    setDomain,
    setCustomDomain,
    setVerifiedCode,
    setPassword,
    setConfirmPassword,
    setNickname,

    sendVerificationEmail,
    onClickVerifyCode,
    handleSubmitForm,
  } = useSignUpForm();

  return (
    <form onSubmit={handleSubmitForm} className="space-y-8">
      <EmailField
        email={email}
        domain={domain}
        customDomain={customDomain}
        isEmailVerified={isEmailVerified}
        isEmailSent={isEmailSent}
        isLoading={isLoading}
        emailError={emailError}
        domainError={domainError}
        onChangeEmail={setEmail}
        onChangeDomain={setDomain}
        onChangeCustomDomain={setCustomDomain}
        onClickSendVerification={sendVerificationEmail}
      />

      {isEmailSent && verifiedEmail && (
        <EmailVerifiedField
          verifiedCode={verifiedCode}
          verifiedCodeError={verifiedCodeError}
          onChangeVerifiedCode={setVerifiedCode}
          onClickVerifyCode={onClickVerifyCode}
          disabled={!(isEmailSent || verifiedEmail)}
          isLoading={isLoading}
        />
      )}

      <PasswordField
        password={password}
        passwordError={passwordError}
        onChangePassword={setPassword}
      />

      <ConfirmPasswordField
        confirmPassword={confirmPassword}
        confirmPasswordError={confirmPasswordError}
        onChangeConfirmPassword={setConfirmPassword}
      />

      <NicknameField
        nickname={nickname}
        nicknameError={nicknameError}
        onChangeNickname={setNickname}
      />

      <Button
        type="submit"
        className="bg-main hover:bg-main-dark text-neutral-0 mt-[10px] h-14 w-full py-3 disabled:cursor-not-allowed disabled:bg-neutral-300"
        disabled={isLoading || !isEmailVerified}
      >
        {isLoading ? '처리 중...' : '회원가입'}
      </Button>
    </form>
  );
};
