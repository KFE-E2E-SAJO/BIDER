import { ProductImage } from '@/entities/productImage/model/types';
import { Profiles } from '@/entities/profiles/model/types';

export interface Product {
  product_id: string;
  exhibit_user_id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  address: string;
  created_at: string;
  updated_at?: string;
}

export interface ProductWithUserNImages extends Product {
  exhibit_user: Profiles;
  product_image: ProductImage[];
}

export interface ProductForEdit extends Product {
  product_image: ProductImage[];
  min_price: number;
  auction_end_at: string;
}

export type ProductForList = Pick<
  Product,
  'title' | 'category' | 'exhibit_user_id' | 'latitude' | 'longitude' | 'address'
> & {
  product_image: ProductImage[];
};

export type ProductForMapList = Pick<Product, 'latitude' | 'longitude'> & {
  product_image: ProductImage[];
};
