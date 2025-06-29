import Search from "@/assets/icons/search.svg";
import BottomSheet from "@/components/BottomSheet";
import BottomSheetContent from "@/components/BottomSheetContent";
import HomeHeader from "@/components/HomeHeader";
import HomeMainSectionWrapper from "@/components/HomeMainSectionWrapper";
import PokemonChat from "@/components/PokemonChat/PokemonChat";
import PokemonList from "@/components/PokemonList/PokemonList";
import { useGetPokemons } from "@/hooks/usePokemon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { BottomSheetType, Pokemon } from "@/types/pokemon";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useMMKVString } from "react-native-mmkv";
export default function Home() {
  const textInput = useRef<TextInput>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [favouritePokemon, setFavouritePokemon] =
    useMMKVString("favouritePokemon");
  const [bottomSheetPokemon, setBottomSheetPokemon] = useState<Pokemon | null>(
    null,
  );
  const [bottomSheetType, setBottomSheetType] = useState<BottomSheetType>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data, isLoading, hasNextPage, fetchNextPage } = useGetPokemons();
  const onReachEnd = () => {
    if (hasNextPage && !isLoading) {
      fetchNextPage();
    }
  };
  const handleOpenBottomSheet = (pokemon: Pokemon, type: BottomSheetType) => {
    bottomSheetRef.current?.present();
    setBottomSheetPokemon(pokemon);
    setBottomSheetType(type);
  };
  const handleCloseBottomSheet = () => {
    setBottomSheetPokemon(null);
  };
  const handleAddToFavorite = (name: string) => {
    setFavouritePokemon(name);
  };

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
    <View
      style={{ flex: 1, backgroundColor: useThemeColor({}, "bgSoftPrimary") }}
    >
      <HomeHeader handleOpenBottomSheet={handleOpenBottomSheet} />
      <HomeMainSectionWrapper>
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
      </HomeMainSectionWrapper>
      <BottomSheet ref={bottomSheetRef} onDismiss={handleCloseBottomSheet}>
        {bottomSheetType === "singlePokemon" && bottomSheetPokemon !== null ? (
          <BottomSheetContent
            pokemon={bottomSheetPokemon}
            handleAddToFavorite={handleAddToFavorite}
          />
        ) : null}
        {bottomSheetType === "chat" && bottomSheetPokemon !== null ? (
          <PokemonChat pokemon={bottomSheetPokemon} />
        ) : null}
      </BottomSheet>
    </View>
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
