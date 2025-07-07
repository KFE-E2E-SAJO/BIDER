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

export interface ProductWithUser extends Product {
  exhibit_user: Profiles[];
}
