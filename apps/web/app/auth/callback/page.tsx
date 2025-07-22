'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../shared/lib/supabaseClient';
import { toast } from '@repo/ui/components/Toast/Sonner';

export default function AuthCallback() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const error = params.get('error');
        const errorDescription = params.get('error_description');

        if (error) {
          console.error('Auth error:', error, errorDescription);
          toast({ content: '이메일 인증 중 오류가 발생했습니다: ' + (errorDescription || error) });

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

        if (accessToken && refreshToken) {
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('Session error:', sessionError);
            toast({ content: '세션 설정 중 오류가 발생했습니다.' });

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

          const { data: userData, error: userError } = await supabase.auth.getUser();

          if (userError || !userData.user) {
            console.error('User error:', userError);
            toast({ content: '사용자 정보를 가져올 수 없습니다.' });

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

          if (userData.user.email_confirmed_at) {
            if (window.opener) {
              window.opener.postMessage(
                {
                  type: 'AUTH_SUCCESS',
                  user: userData.user,
                },
                window.location.origin
              );
              toast({ content: '이메일 인증이 완료되었습니다! 회원가입을 계속 진행해주세요.' });
              window.close();
            } else {
              router.replace('/signup?verified=true');
            }
          } else {
            toast({ content: '이메일 인증이 완료되지 않았습니다.' });
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
          // 토큰 없으면 기존 세션 확인
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
        toast({ content: '예상치 못한 오류가 발생했습니다.' });

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
  }, [router]);

  if (!isProcessing) return null;

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
