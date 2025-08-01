'use client';

import BackBtn from '@/shared/ui/button/BackBtn';
import { Input } from '@repo/ui/components/Input/Input';
import { debounce } from 'lodash';
import { Search } from 'lucide-react';
import { useCallback, useState } from 'react';
import ResultSection from '@/features/search/ui/ResultSection';
import { DEFAULT_AUCTION_LIST_PARAMS } from '@/features/auction/list/constants';

interface SearchClientPageProps {
  address: string;
}
const SearchClientPage = ({ address }: SearchClientPageProps) => {
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState(DEFAULT_AUCTION_LIST_PARAMS.search);

  const updateSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 300),
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

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-box flex items-center gap-[14px] pt-[22px]">
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
        <ResultSection search={search} address={address} />
      </div>
    </div>
  );
};

export default SearchClientPage;
