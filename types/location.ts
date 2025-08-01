export interface Comune {
  id: string;
  post_code: string;
  name: string;
  wilaya_id: string;
  ar_name: string;
  longitude: string;
  latitude: string;
}
export type LocationType = {
  fullLocation?: string;
  coordinates: { lat: number; long: number };
  wilaya?: string;
  commune?: string;
};
