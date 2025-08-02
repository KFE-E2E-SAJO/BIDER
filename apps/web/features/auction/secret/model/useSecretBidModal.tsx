'use client';

import React, { useRef, useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/Dialog/Dialog';
import { Button } from '@repo/ui/components/Button/Button';

type DialogKind = 'timeLimit' | 'pointShort' | 'confirm' | null;

export function useSecretBidDialog() {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<DialogKind>(null);

  // 각 모달별 resolver
  const resolveVoidRef = useRef<(() => void) | null>(null); // alert용
  const resolveBoolRef = useRef<((v: boolean) => void) | null>(null); // confirm용

  const resolveOnceVoid = useCallback(() => {
    resolveVoidRef.current?.();
    resolveVoidRef.current = null;
  }, []);

  const resolveOnceBool = useCallback((v: boolean) => {
    resolveBoolRef.current?.(v);
    resolveBoolRef.current = null;
  }, []);

  // --- API
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
        <DialogHeader className="invisible">
          <DialogTitle>알림</DialogTitle>
        </DialogHeader>

        {/* 내용만 스위칭 */}
        <DialogContent>
          {kind === 'timeLimit' && (
            <>
              <div className="typo-subtitle-small-medium py-[25px] text-center">
                ⏰ 최고 입찰가는 마감 1시간 전까지만 확인할 수 있어요.
              </div>
              <div className="border-t border-neutral-100 pt-2">
                <Button
                  variant="ghost"
                  className="typo-body-medium w-full"
                  onClick={() => {
                    setOpen(false);
                    resolveOnceVoid();
                    setKind(null);
                  }}
                >
                  확인
                </Button>
              </div>
            </>
          )}

          {kind === 'pointShort' && (
            <>
              <div className="typo-subtitle-small-medium py-[25px] text-center">
                500포인트 이상 있어야 최고 입찰가를 확인할 수 있어요.
              </div>
              <div className="border-t border-neutral-100 pt-2">
                <Button
                  variant="ghost"
                  className="typo-body-medium w-full"
                  onClick={() => {
                    setOpen(false);
                    resolveOnceVoid();
                    setKind(null);
                  }}
                >
                  확인
                </Button>
              </div>
            </>
          )}

          {kind === 'confirm' && (
            <>
              <div className="typo-subtitle-small-medium py-[25px] text-center">
                500포인트를 사용하여 최고 입찰가를 확인하시겠어요?
              </div>
              <div className="relative flex items-center justify-center border-t border-neutral-100">
                <Button
                  variant="ghost"
                  className="typo-body-medium w-1/2"
                  onClick={() => {
                    setOpen(false);
                    resolveOnceBool(false);
                    setKind(null);
                  }}
                >
                  취소
                </Button>
                <span className="translate-[-50%] absolute left-1/2 top-1/2 h-[18px] w-[1px] bg-neutral-100" />
                <Button
                  variant="ghost"
                  className="text-main typo-body-medium w-1/2"
                  onClick={() => {
                    setOpen(false);
                    resolveOnceBool(true);
                    setKind(null);
                  }}
                >
                  확인
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    ),
    [open, kind, resolveOnceVoid, resolveOnceBool]
  );

  return {
    DialogHost, // 페이지에 1번만 렌더
    alertTimeLimit, // () => Promise<void>
    alertNotEnoughPoint, // () => Promise<void>
    confirmSpendPoints, // () => Promise<boolean>
  };
}
