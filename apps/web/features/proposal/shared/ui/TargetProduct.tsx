const TargetProduct = () => {
  return (
    <div className="p-box flex gap-[10px] border-b border-t border-neutral-100 py-[13px]">
      <div className="w-[37px]">
        <img src="https://nrxemenkpeejarhejbbk.supabase.co/storage/v1/object/public/product-image/products/416bcd98-8e08-43c7-b174-10a7690cc91f.webp" />
      </div>
      <ul>
        <li className="typo-caption-regular">
          스타벅스 프리퀀시 e-프리퀀시 트렌타월 원하는 걸로 받아드려요.
        </li>
        <li>
          <span className="pr-[4px] text-[10px] text-neutral-600">최고 입찰가</span>
          <span className="typo-caption-medium">32,000원</span>
        </li>
      </ul>
    </div>
  );
};
export default TargetProduct;
