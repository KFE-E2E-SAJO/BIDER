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
