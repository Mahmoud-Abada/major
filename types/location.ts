export interface Comune {
  id: string;
  post_code: string;
  name: string;
  wilaya_id: string;
  ar_name: string;
  longitude: string;
  latitude: string;
}

export interface LocationData {
  type: "manual" | "map";
  comune?: Comune;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}
