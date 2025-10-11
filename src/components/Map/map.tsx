// components/GoogleMapPicker.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

interface GoogleMapPickerProps {
  onLocationChange: (position: { lat: number; lng: number }) => void;
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function GoogleMapPicker({ onLocationChange }: GoogleMapPickerProps) {
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyCSPYDC1TFF35n0DHNSbN0lLklWybV6xW0",
    libraries: ["places"],
  });

  // Get current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setMarkerPosition(coords);
          onLocationChange(coords);
        },
        () => {
          // console.warn("Geolocation permission denied. Using default location.");
          // const defaultCoords = { lat: 40.7128, lng: -74.006 }; // New York default
          // setMarkerPosition(defaultCoords);
          // onLocationChange(defaultCoords);
        }
      );
    }
  }, [onLocationChange]);

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const newPosition = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        console.log(newPosition)
        setMarkerPosition(newPosition);
        onLocationChange(newPosition);
      }
    },
    [onLocationChange]
  );

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={markerPosition || { lat: 40.7128, lng: -74.006 }}
      zoom={13}
      onClick={handleMapClick}
    >
      {markerPosition && <Marker position={markerPosition} />}
    </GoogleMap>
  );
}
