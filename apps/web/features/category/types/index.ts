export const categories = [
  { label: '전체', value: 'all', src: '/cate-all.png' },
  { label: '의류', value: 'clothing', src: '/cate-clothing.png' },
  { label: '잡화', value: 'accessories', src: '/cate-accessories.png' },
  { label: '디지털기기', value: 'digital', src: '/cate-digital.png' },
  { label: '인테리어', value: 'interior', src: '/cate-interior.png' },
  { label: '생활가전', value: 'appliances', src: '/cate-appliances.png' },
  { label: '주방', value: 'kitchen', src: '/cate-kitchen.png' },
  { label: '스포츠', value: 'sports', src: '/cate-sports.png' },
  { label: '취미', value: 'hobby', src: '/cate-hobby.png' },
  { label: '뷰티/미용', value: 'beauty', src: '/cate-beauty.png' },
  { label: '식물', value: 'plants', src: '/cate-plants.png' },
  { label: '반려동물', value: 'pet', src: '/cate-pet.png' },
  { label: '티켓/교환권', value: 'ticket', src: '/cate-ticket.png' },
  { label: '도서', value: 'book', src: '/cate-book.png' },
  { label: '가공식품', value: 'processed-food', src: '/cate-processed-food.png' },
] as const;

export type CategoryValue = (typeof categories)[number]['value'];
