import { Markers } from "@/types/map";
import { Pokemon } from "@/types/pokemon";
import { Image } from "expo-image";
import { LocationObject } from "expo-location";
import { GoogleMaps } from "expo-maps";
import { GoogleMapsMarker } from "expo-maps/build/google/GoogleMaps.types";
import { useEffect, useState } from "react";
type Props = {
  currentLocation: LocationObject | null;
  markers: (Markers & Partial<Pokemon>)[];
};
export default function MapComponent({ currentLocation, markers }: Props) {
  const [newMarkers, setMarkers] = useState<GoogleMapsMarker[]>([]);
  useEffect(() => {
    (async () => {
      const newMarkers: GoogleMapsMarker[] = [];
      await Promise.all(
        markers.map(async (marker) => {
          const ref = await Image.loadAsync(marker.image!);
          newMarkers.push({
            coordinates: {
              latitude: marker.latitude,
              longitude: marker.longitude,
            },
            title: marker.name,
            snippet: marker.name,
            icon: ref,
          });
        }),
      );
      setMarkers(newMarkers);
    })();
  }, [markers]);
  return (
    <GoogleMaps.View
      cameraPosition={{
        coordinates: {
          latitude: currentLocation?.coords.latitude,
          longitude: currentLocation?.coords.longitude,
        },
        zoom: 20,
      }}
      markers={newMarkers}
      style={{ flex: 1 }}
    />
  );
}
