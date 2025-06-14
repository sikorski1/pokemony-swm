import MapComponent from "@/components/Maps/MapComponent";
import { useGetPokemonMarkers } from "@/hooks/usePokemon";
import { Markers } from "@/types/map";
import { Pokemon } from "@/types/pokemon";
import { getCurrentLocation } from "@/utils/getCurrentLocation";
import { LocationObject } from "expo-location";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMMKVString } from "react-native-mmkv";
export default function PokemonMap() {
  const [currentLocation, setCurrentLocation] = useState<LocationObject | null>(
    null,
  );
  const [rawMarkers] = useMMKVString("markers");
  const handleGetCurrentLocationOnSuccess = useCallback(
    (location: LocationObject) => {
      setCurrentLocation(location);
    },
    [],
  );
  const handleGetCurrentLocationOnError = useCallback(() => {}, []);
  useEffect(() => {
    (async () =>
      await getCurrentLocation({
        handleOnError: handleGetCurrentLocationOnError,
        handleOnSuccess: handleGetCurrentLocationOnSuccess,
      }))();
  }, [handleGetCurrentLocationOnSuccess, handleGetCurrentLocationOnError]);
  const markers: Markers[] = useMemo(() => {
    if (!rawMarkers) return [];
    try {
      const parsed = JSON.parse(rawMarkers);
      const markers: Markers[] = Object.values(parsed);
      return markers;
    } catch (e) {
      console.error("Failed to parse markers:", e);
      return [];
    }
  }, [rawMarkers]);
  const pokemonMarkersData = useGetPokemonMarkers(markers);
  const finalMarkers: (Markers & Pokemon)[] = useMemo(() => {
    if (!pokemonMarkersData) return [];
    return markers
      .map((marker, index) => {
        if (!pokemonMarkersData[index].data) return undefined;
        return {
          ...pokemonMarkersData[index].data,
          ...marker,
        };
      })
      .filter((it) => it !== undefined);
  }, [markers, pokemonMarkersData]);
  return (
    <>
      <MapComponent currentLocation={currentLocation} markers={finalMarkers} />
    </>
  );
}
