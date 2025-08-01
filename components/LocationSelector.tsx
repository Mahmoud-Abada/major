import { LocationService } from "@/services/location";
import { Comune, LocationType } from "@/types/location";
import { CircleX, MapPinned } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google: typeof google;
  }
}

interface LocationSelectorProps {
  value: LocationType | null;
  onChange: (location: LocationType | null) => void;
  error?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
  error,
}) => {
  const { theme } = useTheme();
  const locale = useLocale(); // 'en' | 'fr' | 'ar'
  const t = useTranslations("auth");
  const [searchQuery, setSearchQuery] = useState("");
  const [comunes, setComunes] = useState<Comune[]>([]);
  const [showMap, setShowMap] = useState(false);
  // Update your state types
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [isValidLocation, setIsValidLocation] = useState(true);
  const [isAlgeria, setIsAlgeria] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const locationService = LocationService.getInstance();

  // Search comunes when query changes
  useEffect(() => {
    if (!value && searchQuery.length > 2) {
      const results = locationService.searchComunes(searchQuery);
      setComunes(results);
    } else {
      setComunes([]);
    }
  }, [searchQuery, locationService, value]);

  // Initialize map when showMap becomes true
  // Initialize map when showMap becomes true
  useEffect(() => {
    const initializeMap = async () => {
      if (!showMap || !mapRef.current || !window.google?.maps) return;

      try {
        // Dynamically import the required libraries
        await google.maps.importLibrary("maps");
        const markerLibrary = await google.maps.importLibrary("marker");
        const { AdvancedMarkerElement } =
          markerLibrary as typeof google.maps.marker;

        // Clear previous instances
        if (marker) {
          marker.map = null;
          setMarker(null);
        }

        const initialPosition = value?.coordinates
          ? { lat: value.coordinates.lat, lng: value.coordinates.long }
          : {
              lat: 28.0339,
              lng: 1.6596,
            };

        const newMap = new google.maps.Map(mapRef.current, {
          center: initialPosition,
          zoom: 6,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapId: "YOUR_MAP_ID", // REQUIRED for advanced markers
          restriction: {
            latLngBounds: {
              north: 37.296,
              south: 18.96,
              east: 11.99,
              west: -8.668,
            },
            strictBounds: true,
          },
        });

        let newMarker: google.maps.marker.AdvancedMarkerElement | null = null;

        if (value?.coordinates) {
          newMarker = new AdvancedMarkerElement({
            map: newMap,
            position: {
              lat: value.coordinates.lat,
              lng: value.coordinates.long,
            },
            title: "Selected location",
          });
        }

        const clickListener = newMap.addListener(
          "click",
          async (e: google.maps.MapMouseEvent) => {
            if (!e.latLng) return;

            const lat = e.latLng.lat();
            const lng = e.latLng.lng();

            // Check if location is in Algeria
            const inAlgeria = await checkIfInAlgeria(lat, lng);
            setIsAlgeria(inAlgeria);

            if (inAlgeria) {
              if (newMarker) {
                newMarker.position = e.latLng;
              } else {
                newMarker = new AdvancedMarkerElement({
                  map: newMap,
                  position: e.latLng,
                  title: "Selected location",
                });
              }
              setMarker(newMarker);
              setIsValidLocation(true);
            } else {
              setIsValidLocation(false);
              if (newMarker) {
                newMarker.map = null;
                setMarker(null);
              }
            }
          },
        );

        setMap(newMap);
        setMarker(newMarker);

        return () => {
          if (clickListener) {
            google.maps.event.removeListener(clickListener);
          }
          if (newMarker) {
            newMarker.map = null;
          }
        };
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initializeMap();
  }, [showMap, value?.coordinates]);
  const getAddressFromCoordinates = async (
    lat: number,
    lng: number,
  ): Promise<string> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
      );
      const data = await response.json();
      return (
        data.results[0]?.formatted_address ||
        `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      );
    } catch (error) {
      console.error("Error getting address:", error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const checkIfInAlgeria = async (
    lat: number,
    lng: number,
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
      );
      const data = await response.json();
      return data.results.some(
        (result: {
          address_components: Array<{ types: string[]; short_name: string }>;
        }) =>
          result.address_components.some(
            (component: { types: string[]; short_name: string }) =>
              component.types.includes("country") &&
              component.short_name === "DZ",
          ),
      );
    } catch (error) {
      console.error("Error checking location:", error);
      return false;
    }
  };

  const handleComuneSelect = (comune: Comune) => {
    onChange({
      fullLocation: `${comune.name} (${comune.ar_name}), ${comune.post_code}`,
      coordinates: {
        lat: parseFloat(comune.latitude),
        long: parseFloat(comune.longitude), // Changed from lng to long
      },
      wilaya: comune.wilaya_id,
      commune: comune.name,
    });
    setSearchQuery(`${comune.name} (${comune.ar_name}), ${comune.post_code}`);
    setComunes([]);
  };

  const handleMapConfirm = async () => {
    if (marker && isValidLocation && isAlgeria) {
      const position = marker.position;
      if (position) {
        const address = await getAddressFromCoordinates(
          typeof position.lat === "function" ? position.lat() : position.lat,
          typeof position.lng === "function" ? position.lng() : position.lng,
        );

        // Get wilaya and commune from reverse geocoding
        const details = await getLocationDetails(
          typeof position.lat === "function" ? position.lat() : position.lat,
          typeof position.lng === "function" ? position.lng() : position.lng,
        );

        onChange({
          fullLocation: address,
          coordinates: {
            lat:
              typeof position.lat === "function"
                ? position.lat()
                : position.lat,
            long:
              typeof position.lng === "function"
                ? position.lng()
                : position.lng, // Changed to long
          },
          wilaya: details.wilaya,
          commune: details.commune,
        });
        setSearchQuery(address);
      }
      setShowMap(false);
    }
  };

  // Add this helper function
  const getLocationDetails = async (
    lat: number,
    long: number,
  ): Promise<{ wilaya: string; commune: string }> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
      );
      const data = await response.json();

      // Extract wilaya and commune from address components
      let wilaya = "";
      let commune = "";

      if (data.results[0]?.address_components) {
        for (const component of data.results[0].address_components) {
          if (component.types.includes("administrative_area_level_1")) {
            wilaya = component.long_name;
          }
          if (component.types.includes("locality")) {
            commune = component.long_name;
          }
        }
      }

      return { wilaya, commune };
    } catch (error) {
      console.error("Error getting location details:", error);
      return { wilaya: "", commune: "" };
    }
  };

  const clearSelection = () => {
    onChange(null);
    setSearchQuery("");
    setComunes([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const openMapModal = () => {
    setShowMap(true);
    setIsValidLocation(true);
    setIsAlgeria(true);
  };

  const handleInputBlur = () => {
    // If the current value doesn't match any comune, clear it
    if (!value && searchQuery && comunes.length === 0) {
      setSearchQuery("");
    }
  };

  return (
    <div className="space-y-2 relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            if (!value) {
              // Only allow changes when no value is selected
              setSearchQuery(e.target.value);
            }
          }}
          onBlur={handleInputBlur}
          placeholder={t("searchLocationPlaceholder")}
          className={`w-full h-10 rounded-lg border px-3 pr-10 text-sm placeholder-gray-500 focus:outline-none ${
            error
              ? theme === "dark"
                ? "border-red-500/60 bg-red-900/10 text-neutral-100"
                : "border-red-500 bg-red-50 text-neutral-900"
              : value
                ? theme === "dark"
                  ? "border-neutral-700 bg-neutral-800/50 text-neutral-300 cursor-not-allowed"
                  : "border-neutral-300 bg-neutral-100 text-neutral-500 cursor-not-allowed"
                : theme === "dark"
                  ? "border-neutral-700 bg-neutral-800 text-neutral-100"
                  : "border-neutral-300 bg-neutral-100 text-neutral-900"
          }`}
          readOnly={!!value}
        />
        <div
          className={`absolute top-2 ${
            locale === "ar" ? "left-2" : "right-2 "
          } space-x-1`}
        >
          {value && (
            <button
              type="button"
              onClick={clearSelection}
              className={`${
                theme === "dark"
                  ? "text-neutral-400 hover:text-neutral-200"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
              aria-label={t("clearSelection")}
              dir={locale === "ar" ? "rtl" : "ltr"}
            >
              <CircleX size={20} />
            </button>
          )}
          <button
            type="button"
            onClick={openMapModal}
            className={`${
              theme === "dark"
                ? "text-neutral-400 hover:text-blue-400"
                : "text-neutral-500 hover:text-blue-500"
            }`}
            aria-label={t("selectOnMap")}
            disabled={!!value}
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            <MapPinned size={20} />
          </button>
        </div>
      </div>

      {!value && comunes.length > 0 && (
        <ul
          className={`absolute z-10 mt-1 w-full border rounded-lg shadow-lg max-h-60 overflow-auto ${
            theme === "dark"
              ? "bg-neutral-800 border-neutral-700"
              : "bg-white border-neutral-300"
          }`}
        >
          {comunes.map((comune) => (
            <li
              key={comune.id}
              className={`p-2 cursor-pointer ${
                theme === "dark"
                  ? "hover:bg-neutral-700"
                  : "hover:bg-neutral-100"
              }`}
              onClick={() => handleComuneSelect(comune)}
            >
              <div className="flex justify-between">
                <span
                  className={
                    theme === "dark" ? "text-neutral-100" : "text-neutral-900"
                  }
                >
                  {comune.name} ({comune.ar_name})
                </span>
                <span
                  className={
                    theme === "dark" ? "text-neutral-400" : "text-neutral-500"
                  }
                >
                  {comune.post_code}
                </span>
              </div>
              <div
                className={`text-sm ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"}`}
              >
                {t("wilaya")}: {comune.wilaya_id}
              </div>
            </li>
          ))}
        </ul>
      )}

      {showMap && (
        <div
          className={`absolute z-10 top-full mt-2 w-full border rounded-lg shadow-lg ${
            theme === "dark"
              ? "bg-neutral-800 border-neutral-700"
              : "bg-white border-neutral-300"
          }`}
        >
          <div ref={mapRef} className="w-full h-64 rounded-t-lg" />
          <div className="p-2 flex flex-col space-y-2">
            {!isAlgeria && (
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {t("selectWithinAlgeria")}
              </span>
            )}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowMap(false)}
                className={`px-3 py-1 rounded-md text-sm ${
                  theme === "dark"
                    ? "bg-neutral-700 text-neutral-200 hover:bg-neutral-600"
                    : "bg-neutral-200 text-neutral-800 hover:bg-neutral-300"
                }`}
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={handleMapConfirm}
                className={`px-3 py-1 rounded-md text-sm ${
                  theme === "dark"
                    ? "bg-blue-600 text-neutral-50 hover:bg-blue-500 disabled:bg-blue-900 disabled:text-blue-400"
                    : "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300"
                }`}
                disabled={!marker || !isValidLocation || !isAlgeria}
              >
                {t("confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
