export default function HomePage() {
  return (
    // height 100% 주고 싶으면 제일 바깥 div에 flex-1 주시면 됩니다.
    // 내용 만큼만 높이 채워지게 하려면 flex-1 제거 하면 됩니다.
    // 이 주석은 리팩토링때 삭제하겠습니다
    <div className="to-purple-50mx-auto p-box max-w-2xl flex-1 bg-gradient-to-br from-blue-50 text-center">
      <h1 className="mb-6 text-5xl font-bold text-gray-900">🏺 지역기반 중고거래 경매</h1>
      <p className="mb-8 text-xl text-gray-600">우리 동네에서 안전하게 거래하는 경매 서비스</p>

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

      <div className="space-x-4">
        <button className="rounded-md bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700">
          경매 참여하기
        </button>
        <button className="rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-300">
          상품 둘러보기
        </button>
      </div>
    </div>
  );
}
