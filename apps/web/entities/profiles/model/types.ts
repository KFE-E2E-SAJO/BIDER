export interface Profiles {
  user_id: string;
  email: string;
  nickname: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  profile_img?: string;
  point: number;
  created_at: string;
}
export interface ProfileLocationData {
  latitude: number;
  longitude: number;
  address: string;
}
