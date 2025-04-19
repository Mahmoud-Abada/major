import { LocationService } from "@/services/location";
import { Comune, LocationData } from "@/types/location";
import React, { useEffect, useRef, useState } from "react";
import { MapPinned, CircleX } from "lucide-react";

declare global {
  interface Window {
    google: typeof google;
  }
}

interface LocationSelectorProps {
  value: LocationData | null;
  onChange: (location: LocationData | null) => void;
  error?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
  error,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [comunes, setComunes] = useState<Comune[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
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
  useEffect(() => {
    if (showMap && mapRef.current && window.google?.maps) {
      // Clear previous instances
      if (map) {
        window.google.maps.event.clearInstanceListeners(map);
        setMap(null);
      }
      if (marker) {
        marker.setMap(null);
        setMarker(null);
      }

      const initialPosition = value?.coordinates || {
        lat: 28.0339, // Center of Algeria
        lng: 1.6596,
      };

      const newMap = new window.google.maps.Map(mapRef.current, {
        center: initialPosition,
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
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

      let newMarker: google.maps.Marker | null = null;

      if (value?.coordinates) {
        newMarker = new window.google.maps.Marker({
          position: value.coordinates,
          map: newMap,
          draggable: true,
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
              newMarker.setPosition(e.latLng);
            } else {
              newMarker = new window.google.maps.Marker({
                position: e.latLng,
                map: newMap,
                draggable: true,
              });
            }
            setMarker(newMarker);
            setIsValidLocation(true);
          } else {
            setIsValidLocation(false);
            if (newMarker) {
              newMarker.setMap(null);
              setMarker(null);
            }
          }
        },
      );

      setMap(newMap);
      setMarker(newMarker);

      return () => {
        if (clickListener)
          window.google.maps.event.removeListener(clickListener);
      };
    }
  }, [map, marker, showMap, value?.coordinates]);

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
      type: "manual",
      comune,
      coordinates: {
        lat: parseFloat(comune.latitude),
        lng: parseFloat(comune.longitude),
      },
      address: `${comune.name} (${comune.ar_name}), ${comune.post_code}`,
    });
    setSearchQuery(`${comune.name} (${comune.ar_name}), ${comune.post_code}`);
    setComunes([]);
  };

  const handleMapConfirm = async () => {
    if (marker && isValidLocation && isAlgeria) {
      const position = marker.getPosition();
      if (position) {
        const address = await getAddressFromCoordinates(
          position.lat(),
          position.lng(),
        );
        onChange({
          type: "map",
          coordinates: {
            lat: position.lat(),
            lng: position.lng(),
          },
          comune: undefined,
          address,
        });
        setSearchQuery(address);
      }
      setShowMap(false);
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
          placeholder="Search for a location..."
          className={`w-full p-2 pr-10 border rounded-md ${error ? "border-red-500" : "border-gray-300"} ${value ? "bg-gray-100 cursor-not-allowed" : ""}`}
          readOnly={!!value}
        />
        <div className="absolute right-2 top-2 flex space-x-1">
          {value && (
            <button
              type="button"
              onClick={clearSelection}
              className="text-gray-500 hover:text-gray-800"
              aria-label="Clear selection"
            >
              <CircleX size={20} />
            </button>
          )}
          <button
            type="button"
            onClick={openMapModal}
            className="text-gray-500 hover:text-blue-500"
            aria-label="Select on map"
            disabled={!!value}
          >
            <MapPinned size={20} />
          </button>
        </div>
      </div>

      {!value && comunes.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {comunes.map((comune) => (
            <li
              key={comune.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleComuneSelect(comune)}
            >
              <div className="flex justify-between">
                <span>
                  {comune.name} ({comune.ar_name})
                </span>
                <span className="text-gray-500">{comune.post_code}</span>
              </div>
              <div className="text-sm text-gray-500">
                Wilaya: {comune.wilaya_id}
              </div>
            </li>
          ))}
        </ul>
      )}

      {showMap && (
        <div className="absolute z-10 top-full mt-2 w-full border border-gray-300 bg-white rounded-md shadow-lg">
          <div ref={mapRef} className="w-full h-64 rounded-t-md" />
          <div className="p-2 flex flex-col space-y-2">
            {!isAlgeria && (
              <span className="text-red-500 text-sm">
                Please select a location within Algeria
              </span>
            )}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowMap(false)}
                className="px-3 py-1 bg-gray-200 rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleMapConfirm}
                className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
                disabled={!marker || !isValidLocation || !isAlgeria}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
