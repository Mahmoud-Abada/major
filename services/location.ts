import comunesData from "@/data/Comunes.json"; // Your predefined JSON data
import { Comune } from "@/types/location";
import { Loader } from "@googlemaps/js-api-loader";

export class LocationService {
  private static instance: LocationService;
  private googleMapsLoaded = false;

  private constructor() {
    this.loadGoogleMaps();
  }

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  private async loadGoogleMaps(): Promise<void> {
    if (typeof window !== "undefined" && !this.googleMapsLoaded) {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: ["places"], // Add any required libraries here
      });

      try {
        await loader.load();
        this.googleMapsLoaded = true;
      } catch (error) {
        console.error("Failed to load Google Maps API:", error);
      }
    }
  }

  public searchComunes(query: string): Comune[] {
    const normalizedQuery = query.toLowerCase().trim();
    return comunesData.filter(
      (comune) =>
        comune.name.toLowerCase().includes(normalizedQuery) ||
        comune.ar_name.includes(normalizedQuery) || // Search Arabic name too
        comune.post_code.includes(query), // Search by postal code
    );
  }

  public async getAddressFromCoordinates(
    lat: number,
    lng: number,
  ): Promise<string> {
    if (!window.google || !window.google.maps) {
      throw new Error("Google Maps API not loaded");
    }

    const geocoder = new window.google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject(new Error("Geocoder failed due to: " + status));
        }
      });
    });
  }

  public async getCoordinatesFromAddress(
    address: string,
  ): Promise<{ lat: number; lng: number }> {
    if (!window.google || !window.google.maps) {
      throw new Error("Google Maps API not loaded");
    }

    const geocoder = new window.google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results?.[0]?.geometry?.location) {
          resolve({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          });
        } else {
          reject(new Error("Geocoder failed due to: " + status));
        }
      });
    });
  }
}
