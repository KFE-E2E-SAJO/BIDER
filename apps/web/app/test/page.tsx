export default function TailwindTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto space-y-8 px-4">
        {/* 헤더 */}
        <div className="text-center">
          <h1 className="text-h1 mb-2">🧪 Tailwind + CSS Variables 테스트</h1>
          <p className="text-caption">모든 스타일이 올바르게 작동하는지 확인해보세요!</p>
        </div>

        {/* 1. 기본 Tailwind 클래스 테스트 */}
        <section className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-h2 mb-4">1️⃣ 기본 Tailwind 클래스</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-blue-500 p-4 text-center text-white">파란색 카드</div>
            <div className="cursor-pointer rounded-lg bg-green-500 p-4 text-center text-white transition-colors hover:bg-green-600">
              호버 효과 (마우스 올려보세요)
            </div>
            <div className="transform cursor-pointer rounded-lg bg-purple-500 p-4 text-center text-white transition-transform hover:scale-105">
              스케일 효과
            </div>
          </div>
        </section>

        {/* 2. CSS 변수 직접 사용 */}
        <section className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-h2 mb-4">2️⃣ CSS 변수 직접 사용</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              className="rounded-lg p-4 text-center text-white"
              style={{ backgroundColor: 'var(--color-main)' }}
            >
              메인 컬러: var(--color-main)
            </div>
            <div
              className="rounded-lg p-4 text-center text-white"
              style={{ backgroundColor: 'var(--color-alert)' }}
            >
              Alert 컬러: var(--color-alert)
            </div>
            <div
              className="rounded-lg p-4 text-center text-white"
              style={{ backgroundColor: 'var(--color-warning)' }}
            >
              Warning 컬러: var(--color-warning)
            </div>
            <div
              className="rounded-lg p-4 text-center text-white"
              style={{ backgroundColor: 'var(--color-danger)' }}
            >
              Danger 컬러: var(--color-danger)
            </div>
          </div>
        </section>

        {/* 3. 커스텀 Typography 클래스 */}
        <section className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-h2 mb-4">3️⃣ 커스텀 Typography (global.css)</h2>
          <div className="space-y-4">
            <h1 className="text-h1">H1 스타일 테스트</h1>
            <h2 className="text-h2">H2 스타일 테스트</h2>
            <h3 className="text-h3">H3 스타일 테스트</h3>
            <p className="text-body">Body 텍스트 스타일입니다. 일반적인 본문에 사용됩니다.</p>
            <p className="text-caption">Caption 텍스트 스타일입니다. 작은 설명글에 사용됩니다.</p>
          </div>
        </section>

        {/* 4. 애니메이션 테스트 */}
        <section className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-h2 mb-4">4️⃣ 커스텀 애니메이션</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="animate-fade-in rounded-lg border-2 border-blue-300 bg-blue-100 p-4 text-center">
              <strong>Fade In</strong>
              <br />
              페이드인 애니메이션
            </div>
            <div className="animate-slide-up rounded-lg border-2 border-green-300 bg-green-100 p-4 text-center">
              <strong>Slide Up</strong>
              <br />
              슬라이드업 애니메이션
            </div>
            <div className="animate-scale-in rounded-lg border-2 border-purple-300 bg-purple-100 p-4 text-center">
              <strong>Scale In</strong>
              <br />
              스케일인 애니메이션
            </div>
          </div>
        </section>

        {/* 5. 반응형 그리드 테스트 */}
        <section className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-h2 mb-4">5️⃣ 반응형 그리드 (global.css)</h2>
          <div className="grid-4 mb-4">
            <div className="rounded bg-red-200 p-4 text-center">1</div>
            <div className="rounded bg-blue-200 p-4 text-center">2</div>
            <div className="rounded bg-green-200 p-4 text-center">3</div>
            <div className="rounded bg-yellow-200 p-4 text-center">4</div>
          </div>
          <p className="text-caption">
            위 그리드는 모바일에서는 4컬럼, 태블릿에서는 8컬럼으로 변경됩니다.
          </p>
        </section>

        {/* 6. 버튼 스타일 테스트 */}
        <section className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-h2 mb-4">6️⃣ 버튼 스타일 조합</h2>
          <div className="flex flex-wrap gap-4">
            <button
              className="rounded-lg px-4 py-2 text-white transition-colors hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-main)',
                height: 'var(--button-height-md)',
              }}
            >
              메인 버튼
            </button>
            <button
              className="rounded-lg px-4 py-2 text-white transition-colors hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-alert)',
                height: 'var(--button-height-md)',
              }}
            >
              Success 버튼
            </button>
            <button
              className="rounded-lg px-4 py-2 text-white transition-colors hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-warning)',
                height: 'var(--button-height-md)',
              }}
            >
              Warning 버튼
            </button>
            <button
              className="rounded-lg px-4 py-2 text-white transition-colors hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-danger)',
                height: 'var(--button-height-md)',
              }}
            >
              Danger 버튼
            </button>
          </div>
        </section>

        {/* 7. 그림자 및 기타 효과 */}
        <section className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-h2 mb-4">7️⃣ 커스텀 그림자 효과</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div
              className="rounded-lg bg-white p-4 text-center"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              Shadow SM
            </div>
            <div
              className="rounded-lg bg-white p-4 text-center"
              style={{ boxShadow: 'var(--shadow-md)' }}
            >
              Shadow MD
            </div>
            <div
              className="rounded-lg bg-white p-4 text-center"
              style={{ boxShadow: 'var(--shadow-lg)' }}
            >
              Shadow LG
            </div>
            <div
              className="rounded-lg bg-white p-4 text-center"
              style={{ boxShadow: 'var(--shadow-modal)' }}
            >
              Shadow Modal
            </div>
          </div>
        </section>

        {/* 결과 체크리스트 */}
        <section className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-6">
          <h2 className="text-h2 mb-4">✅ 체크리스트</h2>
          <div className="text-body space-y-2">
            <p>□ 모든 색상이 올바르게 표시되나요?</p>
            <p>□ 호버 효과가 부드럽게 작동하나요?</p>
            <p>□ 애니메이션이 자연스럽게 실행되나요?</p>
            <p>□ 텍스트 크기와 색상이 적절한가요?</p>
            <p>□ 그림자 효과가 보이나요?</p>
            <p>□ 반응형 그리드가 화면 크기에 따라 변하나요?</p>
            <p>□ 개발자 도구에서 CSS 에러가 없나요?</p>
          </div>
        </section>
      </div>
    </div>
  );
}
