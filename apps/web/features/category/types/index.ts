export const categories = [
  { label: '전체', value: 'all', src: '/category/cate-all.png' },
  { label: '의류', value: 'clothing', src: '/category/cate-clothing.png' },
  { label: '잡화', value: 'accessories', src: '/category/cate-accessories.png' },
  { label: '디지털기기', value: 'digital', src: '/category/cate-digital.png' },
  { label: '인테리어', value: 'interior', src: '/category/cate-interior.png' },
  { label: '생활가전', value: 'appliances', src: '/category/cate-appliances.png' },
  { label: '주방', value: 'kitchen', src: '/category/cate-kitchen.png' },
  { label: '스포츠', value: 'sports', src: '/category/cate-sports.png' },
  { label: '취미', value: 'hobby', src: '/category/cate-hobby.png' },
  { label: '뷰티/미용', value: 'beauty', src: '/category/cate-beauty.png' },
  { label: '식물', value: 'plants', src: '/category/cate-plants.png' },
  { label: '반려동물', value: 'pet', src: '/category/cate-pet.png' },
  { label: '티켓/교환권', value: 'ticket', src: '/category/cate-ticket.png' },
  { label: '도서', value: 'book', src: '/category/cate-book.png' },
  { label: '가공식품', value: 'processed-food', src: '/category/cate-processed-food.png' },
] as const;

export type CategoryValue = (typeof categories)[number]['value'];

export type CategoryUi = 'inline' | 'grid';
