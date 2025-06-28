'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../shared/lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL에서 code와 error 파라미터 가져오기
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        console.log('URL params:', { code, error, errorDescription });

        if (error) {
          console.error('Auth error:', error, errorDescription);
          setStatus('error');
          setMessage(`인증 오류: ${errorDescription || error}`);
          return;
        }

        if (code) {
          // 인증 코드를 세션으로 교환
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          console.log('Exchange result:', { data, error: exchangeError });

          if (exchangeError) {
            console.error('Exchange error:', exchangeError);
            setStatus('error');
            setMessage('인증 코드 처리 중 오류가 발생했습니다.');
            return;
          }

          if (data.session) {
            console.log('Session created:', data.session);
            setStatus('success');
            setMessage('이메일 인증이 완료되었습니다!');

            setTimeout(() => {
              router.push('/signup?verified=true');
            }, 2000);
          } else {
            setStatus('error');
            setMessage('세션 생성에 실패했습니다.');
          }
        } else {
          // code가 없는 경우 현재 세션 확인
          const { data: sessionData } = await supabase.auth.getSession();

          if (sessionData.session) {
            setStatus('success');
            setMessage('이미 인증된 사용자입니다.');
            setTimeout(() => {
              router.push('/signup?verified=true');
            }, 2000);
          } else {
            setStatus('error');
            setMessage('인증 코드를 찾을 수 없습니다.');
          }
        }
      } catch (error) {
        console.error('Callback error:', error);
        setStatus('error');
        setMessage('인증 처리 중 오류가 발생했습니다.');
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <div className="mb-4">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
            <p>이메일 인증을 처리하고 있습니다...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-4 text-green-600">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-green-600">{message}</p>
            <p className="mt-2 text-sm text-gray-600">
              잠시 후 회원가입 완료 페이지로 이동합니다...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mb-4 text-red-600">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-red-600">{message}</p>
            <button
              onClick={() => router.push('/signup')}
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              회원가입 페이지로 돌아가기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
