export type Step = 'intro' | 'confirm' | 'success';
export type Location = {
  lat: number;
  lng: number;
};
export interface UpdateLocationProps {
  userId: string;
  location: Location;
  address: string;
}
export type LocationWithAddress = {
  location: Location;
  address: string;
};
