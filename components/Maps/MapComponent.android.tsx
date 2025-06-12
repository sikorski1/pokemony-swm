import { Markers } from "@/types/map";
import { Pokemon } from "@/types/pokemon";
import { LocationObject } from "expo-location";
import { GoogleMaps } from "expo-maps";
type Props = {
  currentLocation: LocationObject | null;
  markers: (Markers & Partial<Pokemon>)[];
};
export default function MapComponent({ currentLocation, markers }: Props) {
  return (
    <GoogleMaps.View
      cameraPosition={{
        coordinates: {
          latitude: currentLocation?.coords.latitude,
          longitude: currentLocation?.coords.longitude,
        },
        zoom: 20,
      }}
      markers={markers.map((marker) => ({
        coordinates: { latitude: marker.latitude, longitude: marker.longitude },
        title: marker.name,
        snippet: marker.name,
      }))}

      style={{ flex: 1 }}
    />
  );
}
