'use client';
import { Input } from '@repo/ui/components/Input/Input';
import { Button } from '@repo/ui/components/Button/Button';
import { useState, useEffect } from 'react';
import '@repo/ui/styles.css';

export const LogInForm = () => {
  return (
    <div>
      <form>
        <div className="mt-20 space-y-3">
          <div className="flex items-center gap-2">
            <Input id="email-id" type="id" placeholder="아이디" className="flex-1" />
          </div>
          <div className="space-y-3">
            <Input type="password" placeholder="비밀번호" />
          </div>

          <Button type="submit" className="bg-main hover:bg-main-text text-neutral-0 w-full py-3">
            로그인
          </Button>
        </div>
      </form>

      <div className="m-5 flex items-center justify-center gap-2">
        <a href="#" className="color-neutral-700 flex font-normal">
          아이디 찾기
        </a>
        <span className="color-neutral-700 flex font-normal">|</span>
        <a href="#" className="font-neutral-400 color-neutral-700 flex">
          비밀번호 찾기
        </a>
      </div>
    </div>
  );
};
