# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2025-07-22

### ⚠ Breaking Changes

- 메이저 릴리즈 트리거용 빈 커밋

### ✨ Added

- 경매 상품 스케줄러 로직 병렬 처리 적용
- 경매 상품 스케줄러에 배포 URL 반영
- 거래 희망 장소 기능: 등록, 수정, 상세페이지 반영
- 상품 등록 시 마감 시간 1시간 이후 제한 추가
- 상품목록, 홈, 검색 필터링 및 무한스크롤
- 입찰 현황판 및 최고 입찰가 표시
- 입찰 실시간 반영 (realtime 적용)
- GoogleMapView 컴포넌트 개선
- Switch 컴포넌트, 툴팁, 카테고리 표시 등 UI 기능

### 🐛 Fixed

- Vercel에서 발생하는 렌더링/타입/라우팅 관련 에러 대응
- 회원가입, 비밀번호 페이지 vercel 에러 수정
- 잘못된 import, 중복 onSubmit 핸들러 제거
- 상품 상태 업데이트 로직 오류 수정
- pnpm-lock 충돌 해결

### ♻️ Refactored

- 서버 세션 기반 유저 인증/보호 페이지 처리
- splash, 로그인/회원가입/비번찾기 등 로직 분리
- 미들웨어 리팩토링 및 경로 설정 개선
- 비밀번호 재설정 페이지 및 인증 흐름 개선
- Google Map 재사용성 향상
- tanstack query 기반 상품 CRUD 로직 분리 및 적용

### 🧹 Chore

- CI 설정 테스트 및 수정
- 스플래시 이미지 및 아이콘 다중 적용 (iOS/Android)
- Sentry 및 PWA 설정 추가
- 타입 분리 및 global CSS 변수 수정

### 🧾 Documentation

- README 및 이슈 템플릿 수정

### 🎨 Design

- 이미지 마크업 및 상세페이지 이미지 크기 고정
- 입찰 완료 페이지 UI

### 🔧 Other

- Zustand persist 설정 수정
- 잘못된 merge 및 console.log 제거
- 기능 hotfix 및 페이지별 스타일 개선

## [1.0.0] - 2025-07-18

### Added

- 회원가입, 로그인, 비밀번호 재설정 기능
- 위치설정 기능
- 경매 리스트 조회, 검색 기능
- 경매 상세 조회 기능
- 입찰, 출품 기능
- 출품 수정, 삭제 기능
- 나의 경매 조회 기능
