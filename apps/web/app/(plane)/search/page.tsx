'use client';

import { useProductList } from '@/features/product/model/useProductList';
import LocationPin from '@/features/product/ui/LocationPin';
import ProductList from '@/features/product/ui/ProductList';
import BackBtn from '@/shared/ui/button/BackBtn';
import Loading from '@/shared/ui/Loading/Loading';
import { Input } from '@repo/ui/components/Input/Input';
import { debounce } from 'lodash';
import { Search } from 'lucide-react';
import { useCallback, useState } from 'react';

//LocationPin, BottomBar
const SearchPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');

  const updateSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 1000),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() === '') {
      updateSearch.cancel();
      setSearch('');
    } else {
      updateSearch(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      updateSearch.cancel();
      setSearch(inputValue.trim());
    }
  };

  const { data, isLoading, error } = useProductList({
    lat: 37.371,
    lng: 127.0046,
    search,
  });

  const products = data ?? [];
  let content = null;

  if (isLoading) {
    content = <Loading />;
  } else if (error) {
    content = <p>에러 발생: {(error as Error).message}</p>;
  } else {
    content = <ProductList data={products} />;
  }

  return (
    <div className="p-box flex-1">
      <div className="flex items-center gap-[14px] pt-[22px]">
        <BackBtn />
        <Input
          placeholder="어떤 상품을 찾으시나요?"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="border-none bg-neutral-100"
        />
        <Search />
      </div>
      <div className="flex flex-1 flex-col">
        <LocationPin />
        {content}
      </div>
    </div>
  );
};

export default SearchPage;
