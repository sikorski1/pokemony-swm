import { Markers } from "@/types/map";
import { Pokemon } from "@/types/pokemon";
import { Image } from "expo-image";
import { LocationObject } from "expo-location";
import { AppleMaps } from "expo-maps";
import { AppleMapsAnnotation } from "expo-maps/build/apple/AppleMaps.types";
import { useEffect, useState } from "react";
type Props = {
  currentLocation: LocationObject | null;
  markers: (Markers & Partial<Pokemon>)[];
};
export default function MapComponent({ currentLocation, markers }: Props) {
  const [annotations, setAnnotations] = useState<AppleMapsAnnotation[]>([]);

  useEffect(() => {
    (async () => {
      const newAnnotations: AppleMapsAnnotation[] = [];
      await Promise.all(
        markers.map(async (marker) => {
          const ref = await Image.loadAsync(marker.image!);
          newAnnotations.push({
            coordinates: {
              latitude: marker.latitude,
              longitude: marker.longitude,
            },
            title: marker.name,
            textColor: "white",
            backgroundColor: "black",
            icon: ref,
          });
        }),
      );
      setAnnotations(newAnnotations);
    })();
  }, [markers]);

  return (
    <AppleMaps.View
      cameraPosition={{
        coordinates: {
          latitude: currentLocation?.coords.latitude,
          longitude: currentLocation?.coords.longitude,
        },
        zoom: 16,
      }}
      annotations={annotations}
      style={{ flex: 1 }}
    />
  );
}
