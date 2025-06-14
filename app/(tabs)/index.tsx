import Search from "@/assets/icons/search.svg";
import BottomSheet from "@/components/BottomSheet";
import BottomSheetContent from "@/components/BottomSheetContent";
import Header from "@/components/Header";
import PokemonList from "@/components/PokemonList/PokemonList";
import Wrapper from "@/components/Wrapper";
import { useGetFavouritePokemon, useGetPokemons } from "@/hooks/usePokemon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Pokemon } from "@/types/pokemon";
import { getCurrentLocation } from "@/utils/getCurrentLocation";
import { storage } from "@/utils/storage";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { LocationObject } from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import Toast, { ToastShowParams } from "react-native-toast-message";

export default function Home() {
  const textInput = useRef<TextInput>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [favouritePokemon, setFavouritePokemon] =
    useMMKVString("favouritePokemon");
  const [bottomSheetPokemon, setBottomSheetPokemon] = useState<Pokemon | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data, isLoading, error, hasNextPage, fetchNextPage } =
    useGetPokemons();
  const { name } = useLocalSearchParams();
  const { data: singlePokemonData } = useGetFavouritePokemon(name as string);
  const router = useRouter();
  const onReachEnd = () => {
    if (hasNextPage && !isLoading) {
      fetchNextPage();
    }
  };
  const handleOpenBottomSheet = (pokemon: Pokemon) => {
    bottomSheetRef.current?.present();
    setBottomSheetPokemon(pokemon);
  };
  const handleCloseBottomSheet = () => {
    setBottomSheetPokemon(null);
    router.replace({ pathname: "/", params: {} });
  };
  const handleAddToFavorite = (name: string) => {
    setFavouritePokemon(name);
  };
  const handleShowToast = (params: ToastShowParams) => {
    Toast.show(params);
  };
  const handleGetCurrentLocationOnSuccess = useCallback(
    (location: LocationObject) => {
      if (singlePokemonData) {
        setBottomSheetPokemon(singlePokemonData);
        bottomSheetRef.current?.present();
        handleShowToast({
          type: "success",
          text1: `${singlePokemonData.name.charAt(0).toUpperCase() + singlePokemonData.name.slice(1)} saved!`,
        });
        const newMarker = {
          name:
            singlePokemonData.name.charAt(0).toUpperCase() +
            singlePokemonData.name.slice(1),
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
        };
        const currentMarkers = storage.getString("markers");
        const parsed = currentMarkers ? JSON.parse(currentMarkers) : {};
        parsed[singlePokemonData.name] = newMarker;
        storage.set("markers", JSON.stringify(parsed));
      }
    },
    [singlePokemonData],
  );
  const handleGetCurrentLocationOnError = useCallback(() => {
    if (singlePokemonData) {
      handleShowToast({
        type: "error",
        text1: `${singlePokemonData.name.charAt(0).toUpperCase() + singlePokemonData.name.slice(1)} couldn't be saved!`,
        text2: "Turn on location permission in settings",
      });
    }
  }, [singlePokemonData]);
  useEffect(() => {
    (async () =>
      await getCurrentLocation({
        handleOnError: handleGetCurrentLocationOnError,
        handleOnSuccess: handleGetCurrentLocationOnSuccess,
      }))();
  }, [handleGetCurrentLocationOnSuccess, handleGetCurrentLocationOnError]);
  const { pokemonData } = useMemo<{
    pokemonData: Pokemon[];
  }>(() => {
    return {
      pokemonData: data?.pages?.flatMap((page) => page.detailedResponse) ?? [],
    };
  }, [data]);
  const {
    filteredPokemonData,
    pokemonCount,
  }: { filteredPokemonData: Pokemon[]; pokemonCount: number } = useMemo(() => {
    const filteredPokemonData = pokemonData.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    return {
      filteredPokemonData,
      pokemonCount: filteredPokemonData.length,
    };
  }, [pokemonData, searchQuery]);
  return (
    <>
      <Header handleOpenBottomSheet={handleOpenBottomSheet} />
      <Wrapper>
        <View style={styles.cardsContainer}>
          <View style={styles.pokeTextContainer}>
            <Text
              style={[
                styles.pokedexText,
                {
                  color: useThemeColor({}, "textDefaultPrimary"),
                },
              ]}
            >
              Pokedex
            </Text>
            <Text
              style={[
                styles.pokemonCountText,
                {
                  color: useThemeColor({}, "textDefaultTertiary"),
                },
              ]}
            >
              {pokemonCount || 0} pokemons found
            </Text>
          </View>
          <Pressable
            onPress={() => textInput.current?.focus()}
            style={[
              styles.inputContainer,
              {
                backgroundColor: useThemeColor({}, "bgSoftPrimary"),
                borderColor: useThemeColor({}, "borderSoft"),
              },
            ]}
          >
            <Search fill={useThemeColor({}, "textDefaultPrimary")} />
            <TextInput
              ref={textInput}
              style={[
                styles.input,
                { color: useThemeColor({}, "textDefaultPrimary") },
              ]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search a pokemon..."
              placeholderTextColor={useThemeColor({}, "textDefaultSecondary")}
            />
          </Pressable>
          {filteredPokemonData ? (
            <PokemonList
              filteredPokemonData={filteredPokemonData}
              onReachEnd={onReachEnd}
              handleOpenBottomSheet={handleOpenBottomSheet}
            />
          ) : (
            <View>
              <Text>Loading...</Text>
            </View>
          )}
        </View>
      </Wrapper>
      <BottomSheet ref={bottomSheetRef} onDismiss={handleCloseBottomSheet}>
        {bottomSheetPokemon !== null ? (
          <BottomSheetContent
            pokemon={bottomSheetPokemon}
            handleAddToFavorite={handleAddToFavorite}
          />
        ) : null}
      </BottomSheet>
    </>
  );
}
const styles = StyleSheet.create({
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  pokeTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pokedexText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  pokemonCountText: {},
  inputContainer: {
    flexDirection: "row",
    marginVertical: 8,
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
  },
  input: {
    outlineWidth: 0,
  },
});
