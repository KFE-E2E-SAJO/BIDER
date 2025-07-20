'use client';
import { Input } from '@repo/ui/components/Input/Input';
import { Button } from '@repo/ui/components/Button/Button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectValue,
} from '@repo/ui/components/Select/Select';
import { Check } from 'lucide-react';

interface Props {
  email: string;
  domain: string;
  customDomain: string;
  isEmailVerified: boolean;
  isEmailSent: boolean;
  isLoading: boolean;
  emailError: string;
  domainError: string;
  onChangeEmail: (value: string) => void;
  onChangeDomain: (value: string) => void;
  onChangeCustomDomain: (value: string) => void;
  onClickSendVerification: () => void;
}

export const EmailField = ({
  email,
  domain,
  customDomain,
  isEmailVerified,
  isEmailSent,
  isLoading,
  emailError,
  domainError,
  onChangeEmail,
  onChangeDomain,
  onChangeCustomDomain,
  onClickSendVerification,
}: Props) => {
  const checkEmailInputs = () => {
    if (email.length < 1) return false;
    if (domain.length < 1) return false;
    if (domain === 'custom' && customDomain.length < 1) return false;

    return true;
  };

  return (
    <div className="flex flex-col">
      <label
        htmlFor="email-id"
        className="typo-subtitle-small-medium mb-[8px] block text-neutral-900"
      >
        이메일
        {isEmailVerified && (
          <span className="typo-caption-medium flex text-green-600">
            <Check className="flex" size={15} /> 인증완료
          </span>
        )}
      </label>
      <div className="flex items-center gap-2">
        <Input
          id="email-id"
          type="text"
          placeholder="이메일"
          className="flex-1"
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
          status={emailError ? 'error' : 'default'}
          disabled={isEmailVerified}
        />
        <span className="typo-body-medium text-neutral-600">@</span>

        <Select defaultValue="default" onValueChange={onChangeDomain} disabled={isEmailVerified}>
          <SelectTrigger
            className={`h-13 focus:ring-main focus:border-main flex-1 rounded-sm border placeholder:text-neutral-600 focus:outline-none focus:ring-2 ${domainError ? 'border-danger' : 'border-neutral-400'} ${isEmailVerified ? 'cursor-not-allowed bg-neutral-300' : ''} typo-body-regular data-[placeholder]:text-neutral-600`}
          >
            <SelectValue
              placeholder="도메인을 선택해주세요"
              className="data-[placeholder]:text-neutral-600"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="default">선택해주세요.</SelectItem>
              <SelectItem value="gmail.com">gmail.com</SelectItem>
              <SelectItem value="naver.com">naver.com</SelectItem>
              <SelectItem value="daum.net">daum.net</SelectItem>
              <SelectItem value="custom">직접 입력</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {domain === 'custom' && (
        <input
          className={`typo-body-regular h-13 focus:ring-main focus:border-main w-full rounded-sm border px-3 py-2 text-neutral-700 focus:outline-none focus:ring-2 ${domainError ? 'border-danger' : 'border-neutral-400'} ${isEmailVerified ? 'cursor-not-allowed bg-neutral-300' : ''}`}
          type="text"
          placeholder="도메인을 입력해주세요"
          value={customDomain}
          onChange={(e) => onChangeCustomDomain(e.target.value)}
          disabled={isEmailVerified}
        />
      )}
      {emailError && <p className="typo-caption-regular text-danger">{emailError}</p>}
      {domainError && <p className="typo-caption-regular text-danger">{domainError}</p>}

      <Button
        className={`typo-body-medium mt-[14px] h-12 whitespace-nowrap px-4 ${isEmailVerified ? 'text-neutral-0 cursor-not-allowed bg-green-600' : 'text-neutral-0 bg-neutral-800 hover:bg-neutral-900'}`}
        type="button"
        disabled={!checkEmailInputs() || isEmailVerified || isLoading}
        onClick={onClickSendVerification}
      >
        {isLoading ? (
          '발송 중...'
        ) : isEmailVerified ? (
          <span className="inline-flex items-center gap-1">
            <Check size={15} />
            인증 완료
          </span>
        ) : (
          '이메일 인증하기'
        )}
      </Button>
    </div>
  );
};
