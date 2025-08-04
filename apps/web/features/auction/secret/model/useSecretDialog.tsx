'use client';

import React, { useRef, useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/Dialog/Dialog';
import { Button } from '@repo/ui/components/Button/Button';
import Image from 'next/image';

type DialogKind = 'timeLimit' | 'pointShort' | 'confirm' | 'about' | null;

export function useSecretDialog() {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<DialogKind>(null);

  // 각 모달별 resolver
  const resolveVoidRef = useRef<(() => void) | null>(null); // alert용
  const resolveBoolRef = useRef<((v: boolean) => void) | null>(null); // confirm용

  const alertTimeLimit = useCallback(() => {
    return new Promise<void>((resolve) => {
      resolveVoidRef.current = resolve;
      setKind('timeLimit');
      setOpen(true);
    });
  }, []);

  const alertNotEnoughPoint = useCallback(() => {
    return new Promise<void>((resolve) => {
      resolveVoidRef.current = resolve;
      setKind('pointShort');
      setOpen(true);
    });
  }, []);

  const confirmSpendPoints = useCallback(() => {
    return new Promise<boolean>((resolve) => {
      resolveBoolRef.current = resolve;
      setKind('confirm');
      setOpen(true);
    });
  }, []);

  const openSecretGuide = useCallback(() => {
    return new Promise<void>((resolve) => {
      resolveVoidRef.current = resolve;
      setKind('about');
      setOpen(true);
    });
  }, []);

  // --- 단일 Dialog 호스트
  const DialogHost = useCallback(
    () => (
      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
        }}
        showCloseButton={false}
        closeOnBackdropClick={false}
        closeOnEscape={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>알림</DialogTitle>
        </DialogHeader>
        {kind === 'timeLimit' && (
          <DialogContent showCloseButton={false}>
            <div className="typo-subtitle-small-medium py-[25px] text-center">
              ⏰ 최고 입찰가는 마감 1시간 전까지만 확인할 수 있어요.
            </div>
            <div className="border-t border-neutral-100 pt-2">
              <Button
                variant="ghost"
                className="typo-body-medium w-full"
                onClick={() => {
                  setOpen(false);
                  resolveVoidRef.current?.();
                  resolveVoidRef.current = null;
                  setKind(null);
                }}
              >
                확인
              </Button>
            </div>
          </DialogContent>
        )}

        {kind === 'pointShort' && (
          <DialogContent showCloseButton={false}>
            <div className="typo-subtitle-small-medium py-[25px] text-center">
              500포인트 이상 있어야 최고 입찰가를 확인할 수 있어요.
            </div>
            <div className="border-t border-neutral-100 pt-2">
              <Button
                variant="ghost"
                className="typo-body-medium w-full"
                onClick={() => {
                  setOpen(false);
                  resolveVoidRef.current?.();
                  resolveVoidRef.current = null;
                  setKind(null);
                }}
              >
                확인
              </Button>
            </div>
          </DialogContent>
        )}

        {kind === 'confirm' && (
          <DialogContent showCloseButton={false}>
            <div className="typo-subtitle-small-medium py-[25px] text-center">
              <p>500포인트를 사용해</p>
              <p>최고 입찰가를 확인하시겠어요?</p>
              <p>열람 후에는 10분 동안 현재 최고가가 표시됩니다.</p>
            </div>
            <div className="relative flex items-center justify-center border-t border-neutral-100">
              <Button
                variant="ghost"
                className="typo-body-medium w-1/2"
                onClick={() => {
                  setOpen(false);
                  resolveBoolRef.current?.(false);
                  resolveBoolRef.current = null;
                  setKind(null);
                }}
              >
                취소
              </Button>
              <span className="translate-[-50%] absolute left-1/2 top-1/2 h-[18px] w-[1px] bg-neutral-100" />
              <Button
                variant="ghost"
                className="text-event typo-body-medium w-1/2"
                onClick={() => {
                  setOpen(false);
                  resolveBoolRef.current?.(true);
                  resolveBoolRef.current = null;
                  setKind(null);
                }}
              >
                확인
              </Button>
            </div>
          </DialogContent>
        )}

        {kind === 'about' && (
          <DialogContent showCloseButton={false}>
            <p className="typo-subtitle-medium mt-[15px]">시크릿 경매 안내</p>
            <div className="mb-[23px] mt-[15px] flex justify-center">
              <Image src="/secret-info1.svg" alt="시크릿 경매 아이콘" width={130} height={127} />
            </div>
            <ul className="typo-body-reguler list-disc px-[16px] text-neutral-900">
              <li>
                시크릿 경매는 입찰자와 출품자 모두{' '}
                <span className="text-event">
                  최고 입찰가와 입찰 현황판을 확인할 수 없는 비공개 경매 방식
                </span>
                입니다.
              </li>
              <li>경매가 종료되면, 가장 높은 금액을 입찰한 사용자가 자동으로 낙찰됩니다.</li>
              <li>
                출품자는 상품 등록 시 ‘시크릿 경매’ 여부를 선택할 수 있으며, 경매가 시작되면 변경이
                불가합니다.
              </li>
            </ul>
            <div className="mt-[-10px] flex justify-center">
              <Image
                src="/secret-info2.svg"
                alt="최고 입찰가 확인하기 버튼 이미지"
                width={280}
                height={45}
              />
            </div>
            <ul className="typo-body-reguler mb-[10px] list-disc px-[16px] text-neutral-900">
              <li>
                입찰자는 상품 상세 페이지의 ‘최고 입찰가 확인하기’ 버튼을 통해{' '}
                <span className="text-event">500포인트</span>를 사용해{' '}
                <span className="text-event">현재 최고가를 10분간 확인</span>할 수 있습니다.
              </li>
              <li>단, 경매 종료 1시간 전부터는 최고가 확인이 제한됩니다.</li>
            </ul>
            <div className="border-t border-neutral-100 pt-2">
              <Button
                variant="ghost"
                className="typo-body-medium w-full"
                onClick={() => {
                  setOpen(false);
                  resolveVoidRef.current?.();
                  resolveVoidRef.current = null;
                  setKind(null);
                }}
              >
                닫기
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    ),
    [open, kind]
  );

  return {
    DialogHost,
    alertTimeLimit,
    alertNotEnoughPoint,
    confirmSpendPoints,
    openSecretGuide,
  };
}
