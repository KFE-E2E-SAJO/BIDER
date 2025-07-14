'use client';
import { Input } from '@repo/ui/components/Input/Input';
import { User, Mail, ChevronLeft } from 'lucide-react';
import '@repo/ui/styles.css';
import { Button } from '@repo/ui/components/Button/Button';
import { useFindId } from '@/features/find-id/model/useFindId';
import { useRouter } from 'next/navigation';
import { FindAccountConfig } from '@/features/find-id/lib/findAccountConfig';

export default function FindAccountPage() {
  const { inputValue, isFound, isSearching, accountType, result, setInputValue, handleSubmit } =
    useFindId();

  const router = useRouter();
  const config = FindAccountConfig(accountType);

  return (
    <div className="p-box">
      <ChevronLeft className="mt-[30px] cursor-pointer" onClick={() => router.back()} />
      <p className="typo-body-medium mt-[11.5rem] flex justify-center text-[1.25rem]">
        {config.title}
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <Input
            className="mt-[1.81rem]"
            type={config.inputType}
            icon={config.icon}
            placeholder={config.placeholder}
            inputStyle="pl-12 pr-11"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isFound}
            required
          />
        </div>

        <Button type="submit" className="mt-[0.81rem]" disabled={isSearching || isFound}>
          {isSearching ? '처리 중...' : config.buttonText}
        </Button>
      </form>

      {isFound && result && (
        <div className="mt-[2rem] rounded-lg p-4 text-left">
          <div className="mb-3 rounded-sm border border-neutral-300">
            <p className="mb-1 mt-[1.12rem] pl-4 text-sm text-gray-600">
              {accountType === 'email' ? '사용자 이름과 일치하는 이메일입니다:' : '발송 완료:'}
            </p>
            <p className="typo-caption-medium mb-2 pl-4 text-sm">
              {config.resultPrefix}
              {result}
            </p>
            <p className="mb-[1.12rem] mt-2 pl-4 text-xs text-gray-500">{config.description}</p>
          </div>

          <div className="flex-cols flex gap-[0.56rem]">
            <Button variant="secondary" className="flex-1" onClick={() => router.push('/login')}>
              로그인 하기
            </Button>

            {accountType == 'email' && (
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => router.push('/find-id?type=password')}
              >
                비밀번호 찾기
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
