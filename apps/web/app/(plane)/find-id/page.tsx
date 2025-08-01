'use client';
import { Input } from '@repo/ui/components/Input/Input';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@repo/ui/components/Button/Button';
import { useFindId } from '@/features/find-id/model/useFindId';
import { useRouter } from 'next/navigation';
import { FindAccountConfig } from '@/features/find-id/lib/findAccountConfig';
import { Suspense } from 'react';
import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';

function FindAccountContent() {
  const { inputValue, isFound, isSearching, accountType, result, setInputValue, handleSubmit } =
    useFindId();

  const router = useRouter();
  const config = FindAccountConfig(accountType);
  const Icon = config.icon;

  return (
    <ReactQueryProvider>
      <div className="p-box">
        <ChevronLeft
          className="mt-[30px] size-[30px] cursor-pointer stroke-[#8C8C8C] stroke-[1.5]"
          onClick={() => router.back()}
        />
        <p className="typo-subtitle-medium mb-[29px] mt-[121px] flex justify-center text-center">
          {config.title}
        </p>

        <form onSubmit={handleSubmit}>
          <div>
            <Input
              className="mt-[1.81rem]"
              type={config.inputType}
              icon={<Icon />}
              placeholder={config.placeholder}
              inputStyle="px-[50px]"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isFound}
              required
            />
          </div>

          <Button
            type="submit"
            className="h-13 typo-body-medium mt-[13px]"
            disabled={isSearching || isFound}
          >
            {isSearching ? '처리 중...' : config.buttonText}
          </Button>
        </form>

        {isFound && result && (
          <div className="mt-[2rem] rounded-lg text-left">
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

            <div className="flex justify-between gap-3">
              <Button
                variant="secondary"
                className="h-13 typo-body-medium flex-1"
                onClick={() => router.push('/login')}
              >
                로그인 하기
              </Button>

              {accountType == 'email' && (
                <Button
                  variant="secondary"
                  className="h-13 typo-body-medium flex-1"
                  onClick={() => router.push('/find-id?type=password')}
                >
                  비밀번호 찾기
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </ReactQueryProvider>
  );
}

const FindAccountPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FindAccountContent />
    </Suspense>
  );
};

export default FindAccountPage;
