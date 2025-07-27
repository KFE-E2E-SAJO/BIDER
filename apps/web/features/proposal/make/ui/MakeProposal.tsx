import MakePrice from '@/features/proposal/make/ui/MakePrice';
import TargetProduct from '@/features/proposal/make/ui/TargetProduct';

const MakeProposal = () => {
  return (
    <div>
      <TargetProduct />
      <MakePrice />
      <ul className="p-box bg-warning-light text-warning-medium typo-caption-medium fixed bottom-0 left-0 w-full list-inside list-disc pb-[93px] pt-[20px]">
        <li>제안하기 사용 시 100포인트가 차감돼요.</li>
        <li>최고 입찰가 이상으로만 제안이 가능해요.</li>
        <li>제안 성공 시 거래는 즉시 종료돼요.</li>
        <li>제안은 철회할 수 없어요.</li>
        <li>출품자가 24시간 내에 응답하지 않으면 제안은 자동으로 만료돼요.</li>
        <li>제안이 거절돼도 포인트는 반환되지 않아요.</li>
      </ul>
    </div>
  );
};

export default MakeProposal;
