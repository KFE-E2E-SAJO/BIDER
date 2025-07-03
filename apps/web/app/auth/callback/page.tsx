'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../shared/lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL에서 인증 관련 파라미터 확인
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        console.log(accessToken, refreshToken, error, errorDescription);

        // 에러가 있는 경우
        if (error) {
          console.error('Auth error:', error, errorDescription);
          alert('이메일 인증 중 오류가 발생했습니다: ' + (errorDescription || error));

          // 부모 창에 에러 메시지 전송
          if (window.opener) {
            window.opener.postMessage(
              {
                type: 'AUTH_ERROR',
                error: errorDescription || error,
              },
              window.location.origin
            );
            window.close();
          } else {
            router.replace('/signup');
          }
          return;
        }

        // 토큰이 있는 경우 세션 설정
        if (accessToken && refreshToken) {
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('Session error:', sessionError);
            alert('세션 설정 중 오류가 발생했습니다.');

            if (window.opener) {
              window.opener.postMessage(
                {
                  type: 'AUTH_ERROR',
                  error: '세션 설정 중 오류가 발생했습니다.',
                },
                window.location.origin
              );
              window.close();
            } else {
              router.replace('/signup');
            }
            return;
          }

          // 사용자 정보 확인
          const { data: userData, error: userError } = await supabase.auth.getUser();

          if (userError || !userData.user) {
            console.error('User error:', userError);
            alert('사용자 정보를 가져올 수 없습니다.');

            if (window.opener) {
              window.opener.postMessage(
                {
                  type: 'AUTH_ERROR',
                  error: '사용자 정보를 가져올 수 없습니다.',
                },
                window.location.origin
              );
              window.close();
            } else {
              router.replace('/signup');
            }
            return;
          }

          // 이메일 인증 완료 확인
          if (userData.user.email_confirmed_at) {
            console.log('Email verified successfully for:', userData.user.email);

            if (window.opener) {
              window.opener.postMessage(
                {
                  type: 'AUTH_SUCCESS',
                  user: userData.user,
                },
                window.location.origin
              );
              // 성공 메시지 표시 후 창 닫기
              alert('이메일 인증이 완료되었습니다! 회원가입을 계속 진행해주세요.');
              window.close();
            } else {
              router.replace('/signup?verified=true');
            }
          } else {
            alert('이메일 인증이 완료되지 않았습니다.');

            if (window.opener) {
              window.opener.postMessage(
                {
                  type: 'AUTH_ERROR',
                  error: '이메일 인증이 완료되지 않았습니다.',
                },
                window.location.origin
              );
              window.close();
            } else {
              router.replace('/signup');
            }
          }
        } else {
          // 토큰이 없는 경우 기본 세션 확인
          const { data, error: sessionError } = await supabase.auth.getSession();

          if (sessionError) {
            console.error('Session check error:', sessionError);
            router.replace('/signup');
            return;
          }

          if (data.session?.user?.email_confirmed_at) {
            router.replace('/signup?verified=true');
          } else {
            router.replace('/signup');
          }
        }
      } catch (error) {
        console.error('Unexpected error in callback:', error);
        alert('예상치 못한 오류가 발생했습니다.');

        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'AUTH_ERROR',
              error: '예상치 못한 오류가 발생했습니다.',
            },
            window.location.origin
          );
          window.close();
        } else {
          router.replace('/signup');
        }
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  if (!isProcessing) {
    return null; // 처리 완료 후 리다이렉트 되므로 아무것도 보여주지 않음
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        </div>
        <p className="text-neutral-600">이메일 인증을 처리하고 있습니다...</p>
        <p className="mt-2 text-sm text-neutral-400">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}
