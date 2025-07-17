import { categories, CategoryValue } from '@/features/category/types';

export function sortCategories(selected: CategoryValue) {
  const [all, ...rest] = categories;
  const selectedItem = rest.find((item) => item.value === selected);
  const others = rest.filter((item) => item.value !== selected);
  return [all, ...(selectedItem ? [selectedItem] : []), ...others];
}

export const getCategoryLabel = (value: CategoryValue): string => {
  const category = categories.find((c) => c.value === value);
  return category?.label ?? '';
};
