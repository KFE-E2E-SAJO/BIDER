// import type { Meta, StoryObj } from '@storybook/react-vite';
// import { Button } from '@repo/ui/components/Button/Button';

// // React Icons 예시 (실제 프로젝트에서 사용할 아이콘들)
// import {
//   ArrowRight,
//   Download,
//   Edit3, //(※ 최신 버전엔 PenLine/Pencil로 대체될 수 있음)
//   Heart,
//   Plus,
//   Search,
//   Share2,
//   User,
//   Settings,
//   Trash,
// } from 'lucide-react';

// const meta = {
//   title: 'Components/Button',
//   component: Button,
//   parameters: {
//     layout: 'centered',
//     docs: {
//       description: {
//         component: `
// ## Button 컴포넌트

// 지역기반 중고거래 경매 모바일 웹앱에 최적화된 버튼 컴포넌트입니다.

// ### 🎯 설계 원칙
// - **단일 책임 원칙**: 사용자 클릭 액션만 담당
// - **의존성 최소화**: react-icons만 의존, 완전히 독립적
// - **아토믹 디자인**: Atom 레벨의 기본 요소

// ### 📋 설계 기준 적용
// 1. **디자인 시스템 기반**: CSS 변수 활용, 일관된 스타일
// 2. **API 설계 기준**: 직관적인 Props 네이밍
// 3. **재사용성 기준**: 3가지 버튼 타입 지원

// ### 🔧 3가지 버튼 타입
// - **아이콘만**: 최소한의 공간을 차지하는 액션 버튼
// - **텍스트만**: 명확한 라벨이 있는 일반 버튼
// - **아이콘+텍스트**: 시각적 힌트와 명확한 라벨을 모두 제공

// ### 🎨 스타일 가이드
// - **폰트 크기**: 16px
// - **테두리**: 3px 둥근 모서리
// - **패딩**: 일반 버튼 15px, 아이콘만 20px
// - **아이콘 크기**: 16px
// - **호버 효과**: disabled 상태에서는 비활성화
//         `,
//       },
//     },
//   },
//   tags: ['autodocs'],
//   argTypes: {
//     variant: {
//       control: { type: 'select' },
//       options: ['primary', 'secondary', 'ghost'],
//       description: '버튼의 시각적 스타일 변형',
//     },
//     disabled: {
//       control: 'boolean',
//       description: '버튼 비활성화 상태',
//     },
//     children: {
//       control: 'text',
//       description: '버튼 텍스트 (아이콘만 있는 버튼은 생략 가능)',
//     },
//     ariaLabel: {
//       control: 'text',
//       description: '접근성을 위한 aria-label (아이콘만 있는 버튼에 필수)',
//     },
//     onClick: {
//       action: 'clicked',
//       description: '클릭 이벤트 핸들러',
//     },
//   },
// } satisfies Meta<typeof Button>;

// export default meta;
// type Story = StoryObj<typeof meta>;

// // === 📏 기본 변형별 스토리 ===

// export const Primary: Story = {
//   args: {
//     variant: 'primary',
//     children: '확인',
//   },
// };

// export const Secondary: Story = {
//   args: {
//     variant: 'secondary',
//     children: '취소',
//   },
// };

// export const Ghost: Story = {
//   args: {
//     variant: 'ghost',
//     children: '더보기',
//   },
// };

// // === 🔧 3가지 버튼 타입 시연 ===

// export const ButtonTypes: Story = {
//   render: () => (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-h3 mb-3">📝 텍스트만 있는 버튼</h3>
//         <div className="flex gap-3">
//           <Button variant="primary">입찰하기</Button>
//           <Button variant="secondary">관심등록</Button>
//           <Button variant="ghost">더보기</Button>
//         </div>
//       </div>

//       <div>
//         <h3 className="text-h3 mb-3">🔤 아이콘+텍스트 버튼</h3>
//         <div className="flex gap-3">
//           <Button variant="primary" Icon={Plus}>
//             상품 등록
//           </Button>
//           <Button variant="secondary" Icon={Heart}>
//             관심 상품
//           </Button>
//           <Button variant="ghost" Icon={Share2}>
//             공유하기
//           </Button>
//         </div>
//       </div>

//       <div>
//         <h3 className="text-h3 mb-3">🎯 아이콘만 있는 버튼</h3>
//         <div className="flex gap-3">
//           <Button variant="primary" Icon={Plus} ariaLabel="추가" />
//           <Button variant="secondary" Icon={Heart} ariaLabel="좋아요" />
//           <Button variant="ghost" Icon={Share2} ariaLabel="공유" />
//         </div>
//       </div>
//     </div>
//   ),
//   parameters: {
//     docs: {
//       description: {
//         story: '3가지 버튼 타입을 모두 보여주는 예시입니다. 각각의 사용 시나리오가 다릅니다.',
//       },
//     },
//   },
// };

// // === 🎨 상태별 스토리 ===

// export const States: Story = {
//   render: () => (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-h3 mb-3">✅ 활성화 상태</h3>
//         <div className="flex gap-3">
//           <Button variant="primary">Primary</Button>
//           <Button variant="secondary">Secondary</Button>
//           <Button variant="ghost">Ghost</Button>
//         </div>
//       </div>

//       <div>
//         <h3 className="text-h3 mb-3">❌ 비활성화 상태</h3>
//         <div className="flex gap-3">
//           <Button variant="primary" disabled>
//             Primary
//           </Button>
//           <Button variant="secondary" disabled>
//             Secondary
//           </Button>
//           <Button variant="ghost" disabled>
//             Ghost
//           </Button>
//         </div>
//       </div>

//       <div>
//         <h3 className="text-h3 mb-3">🔧 아이콘 버튼 상태</h3>
//         <div className="space-y-3">
//           <div className="flex gap-3">
//             <Button variant="primary" Icon={Edit3} ariaLabel="수정" />
//             <Button variant="secondary" Icon={Download} ariaLabel="다운로드" />
//             <Button variant="ghost" Icon={Settings} ariaLabel="설정" />
//           </div>
//           <div className="flex gap-3">
//             <Button variant="primary" Icon={Edit3} disabled ariaLabel="수정" />
//             <Button variant="secondary" Icon={Download} disabled ariaLabel="다운로드" />
//             <Button variant="ghost" Icon={Settings} disabled ariaLabel="설정" />
//           </div>
//         </div>
//       </div>
//     </div>
//   ),
//   parameters: {
//     docs: {
//       description: {
//         story:
//           '버튼의 활성화/비활성화 상태를 보여줍니다. 비활성화 상태에서는 호버 효과가 없습니다.',
//       },
//     },
//   },
// };

// // === 🛍️ 경매 앱 실제 사용 예시 ===

// export const AuctionAppExamples: Story = {
//   render: () => (
//     <div className="max-w-sm space-y-6">
//       <div>
//         <h3 className="text-h3 mb-3">🏠 홈화면 액션</h3>
//         <div className="space-y-2">
//           <Button variant="primary" Icon={Plus} className="w-full">
//             상품 등록하기
//           </Button>
//           <div className="flex gap-2">
//             <Button variant="secondary" Icon={Search} className="flex-1">
//               검색
//             </Button>
//             <Button variant="ghost" Icon={User} ariaLabel="프로필" />
//           </div>
//         </div>
//       </div>

//       <div>
//         <h3 className="text-h3 mb-3">💰 경매 상세 페이지</h3>
//         <div className="space-y-2">
//           <Button variant="primary" className="w-full">
//             입찰하기
//           </Button>
//           <div className="flex gap-2">
//             <Button variant="secondary" Icon={Heart} className="flex-1">
//               관심 등록
//             </Button>
//             <Button variant="ghost" Icon={Share2} ariaLabel="공유하기" />
//           </div>
//         </div>
//       </div>

//       <div>
//         <h3 className="text-h3 mb-3">⚙️ 관리 액션</h3>
//         <div className="flex gap-2">
//           <Button variant="ghost" Icon={Edit3}>
//             수정
//           </Button>
//           <Button variant="secondary" Icon={Download}>
//             다운로드
//           </Button>
//           <Button variant="primary" Icon={Trash}>
//             삭제
//           </Button>
//         </div>
//       </div>

//       <div>
//         <h3 className="text-h3 mb-3">🎯 빠른 액션 (아이콘만)</h3>
//         <div className="flex justify-center gap-2">
//           <Button variant="ghost" Icon={Heart} ariaLabel="좋아요" />
//           <Button variant="ghost" Icon={Share2} ariaLabel="공유" />
//           <Button variant="ghost" Icon={Download} ariaLabel="다운로드" />
//           <Button variant="ghost" Icon={Settings} ariaLabel="설정" />
//         </div>
//       </div>
//     </div>
//   ),
//   parameters: {
//     docs: {
//       description: {
//         story:
//           '실제 경매 앱에서 사용될 수 있는 버튼 조합 예시들입니다. 모바일 UI 패턴을 반영했습니다.',
//       },
//     },
//   },
// };

// // === 🎨 스타일 가이드 시연 ===

// export const StyleGuide: Story = {
//   render: () => (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-h3 mb-3">🎨 Primary 버튼 (메인 액션)</h3>
//         <div className="space-y-2">
//           <p className="text-caption">배경: #64B5F7, 텍스트: white, 호버: #045A9A</p>
//           <div className="flex items-center gap-3">
//             <Button variant="primary">입찰하기</Button>
//             <Button variant="primary" Icon={ArrowRight}>
//               다음 단계
//             </Button>
//             <Button variant="primary" Icon={Plus} ariaLabel="추가" />
//           </div>
//         </div>
//       </div>

//       <div>
//         <h3 className="text-h3 mb-3">🎨 Secondary 버튼 (보조 액션)</h3>
//         <div className="space-y-2">
//           <p className="text-caption">배경: white, 테두리: #64B5F7, 텍스트: #64B5F7</p>
//           <div className="flex items-center gap-3">
//             <Button variant="secondary">취소</Button>
//             <Button variant="secondary" Icon={Heart}>
//               관심등록
//             </Button>
//             <Button variant="secondary" Icon={Share2} ariaLabel="공유" />
//           </div>
//         </div>
//       </div>

//       <div>
//         <h3 className="text-h3 mb-3">🎨 Ghost 버튼 (미니멀 액션)</h3>
//         <div className="space-y-2">
//           <p className="text-caption">배경: transparent, 텍스트: #64B5F7</p>
//           <div className="flex items-center gap-3">
//             <Button variant="ghost">더보기</Button>
//             <Button variant="ghost" Icon={Edit3}>
//               수정
//             </Button>
//             <Button variant="ghost" Icon={Settings} ariaLabel="설정" />
//           </div>
//         </div>
//       </div>
//     </div>
//   ),
//   parameters: {
//     docs: {
//       description: {
//         story: '각 variant의 색상과 스타일을 자세히 보여주는 가이드입니다.',
//       },
//     },
//   },
// };

// // === ♿ 접근성 테스트 ===

// export const AccessibilityTest: Story = {
//   render: () => (
//     <div className="space-y-4">
//       <div>
//         <h3 className="text-h3 mb-3">♿ 접근성 테스트</h3>
//         <p className="text-caption mb-4">Tab 키로 포커스 이동, Space/Enter로 클릭 테스트</p>
//         <div className="space-y-3">
//           <div className="flex gap-2">
//             <Button variant="primary">포커스 테스트 1</Button>
//             <Button variant="secondary" Icon={Heart}>
//               포커스 테스트 2
//             </Button>
//             <Button variant="ghost" Icon={Settings} ariaLabel="설정 (아이콘만)" />
//           </div>

//           <div className="rounded-lg bg-[var(--color-background)] p-3">
//             <p className="text-caption">
//               ✅ 아이콘만 있는 버튼에는 ariaLabel 필수
//               <br />
//               ✅ 포커스 링 표시
//               <br />
//               ✅ 키보드 네비게이션 지원
//               <br />✅ 적절한 색상 대비
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   ),
//   parameters: {
//     docs: {
//       description: {
//         story: '키보드 네비게이션과 스크린 리더 지원을 테스트할 수 있습니다.',
//       },
//     },
//   },
// };

// // === 🔧 인터랙티브 테스트 ===

// export const Interactive: Story = {
//   args: {
//     variant: 'primary',
//     children: '클릭해보세요!',
//     Icon: Plus,
//     onClick: () => alert('🎉 버튼이 클릭되었습니다!'),
//   },
//   parameters: {
//     docs: {
//       description: {
//         story:
//           '실제로 클릭해볼 수 있는 인터랙티브 버튼입니다. Controls 패널에서 속성을 변경해보세요!',
//       },
//     },
//   },
// };
