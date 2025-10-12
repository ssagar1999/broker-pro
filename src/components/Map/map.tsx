"use client";

import { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

interface GoogleMapPickerProps {
  onLocationChange: (position: { lat: number; lng: number }) => void;
  initialPosition?: { lat: number; lng: number } | null;
}

export default function GoogleMapPicker({
  onLocationChange,
  initialPosition,
}: GoogleMapPickerProps) {
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  // Update marker position when initialPosition changes
  useEffect(() => {
    if (initialPosition) {
      console.log("🗺️ Setting initial position:", initialPosition);
      setMarkerPosition(initialPosition);
      onLocationChange(initialPosition);
    }
  }, [initialPosition, onLocationChange]);

  // Only run geolocation once on mount if no initial position
  useEffect(() => {
    if (!initialPosition && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setMarkerPosition(coords);
          onLocationChange(coords);
        },
        () => {
          console.warn("Geolocation permission denied.");
          const defaultCoords = { lat: 40.7128, lng: -74.006 }; // fallback
          setMarkerPosition(defaultCoords);
          onLocationChange(defaultCoords);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <- empty dependency array ensures it runs only once

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const newPosition = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        setMarkerPosition(newPosition);
        onLocationChange(newPosition);
      }
    },
    [onLocationChange]
  );

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "400px" }}
      center={markerPosition || undefined} // controlled only after initial set
      zoom={13}
      onClick={handleMapClick}
    >
      {markerPosition && <Marker position={markerPosition} draggable onDragEnd={handleMapClick} />}
    </GoogleMap>
  );
}
