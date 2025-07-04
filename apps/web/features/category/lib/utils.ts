import { categories, CategoryValue } from '@/features/category/types';

export function sortCategories(selected: CategoryValue) {
  const [all, ...rest] = categories;
  const selectedItem = rest.find((item) => item.value === selected);
  const others = rest.filter((item) => item.value !== selected);
  return [all, ...(selectedItem ? [selectedItem] : []), ...others];
}
