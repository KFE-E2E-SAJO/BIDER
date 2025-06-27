import Header from '@/widgets/header/Header';
import Nav from '@/widgets/nav/Nav';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="mb-6 text-5xl font-bold text-gray-900">🏺 지역기반 중고거래 경매</h1>
        <p className="mb-8 text-xl text-gray-600">우리 동네에서 안전하게 거래하는 경매 서비스</p>

        {/* 설정 완료 상태 */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-md">
            <h3 className="mb-2 font-semibold text-green-600">✅ 개발 환경</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>Next.js 15.2.3</li>
              <li>TypeScript 5.8.2</li>
              <li>React 19.1.0</li>
            </ul>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-md">
            <h3 className="mb-2 font-semibold text-green-600">✅ 도구 설정</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>ESLint + Prettier</li>
              <li>Lefthook</li>
              <li>Tailwind CSS v4</li>
            </ul>
          </div>
        </div>

        {/* 테스트 버튼 */}
        <div className="space-x-4">
          <button className="rounded-md bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700">
            경매 참여하기
          </button>
          <button className="rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-300">
            상품 둘러보기
          </button>
        </div>
      </div>
    </main>
  );
}
