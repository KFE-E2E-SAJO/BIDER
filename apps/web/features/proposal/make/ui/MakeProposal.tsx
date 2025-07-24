import { Input } from '@repo/ui/components/Input/Input';

const MakeProposal = () => {
  return (
    <div>
      <div>
        <div>얼마로 제안할까요?</div>
        <p>100포인트를 사용해 가격을 제안할 수 있어요.</p>
      </div>
      <Input
        value=""
        // onChange={handleMinPriceChange}
        placeholder="희망하는 최소 입찰가를 적어주세요."
        required
      />
    </div>
  );
};

export default MakeProposal;
