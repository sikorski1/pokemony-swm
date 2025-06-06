import Search from "@/assets/icons/search.svg";
import SettingsIcon from "@/assets/icons/settings.svg";
import Logo from "@/assets/images/favicon.svg";
import BottomSheet from "@/components/BottomSheet";
import BottomSheetContent from "@/components/BottomSheetContent";
import FavouritePokemon from "@/components/FavouritePokemon";
import PokemonItem from "@/components/PokemonItem";
import { useGetFavouritePokemon, useGetPokemons } from "@/hooks/usePokemon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Pokemon } from "@/types/pokemon";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMemo, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PokemonList() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [favouritePokemon, setFavouritePokemon] =
    useMMKVString("favouritePokemon");
  const [bottomSheetPokemon, setBottomSheetPokemon] = useState<Pokemon | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data, isLoading, error, hasNextPage, fetchNextPage } =
    useGetPokemons();
  const { data: favouritePokemonData, isLoading: isLoadingFavouritePokemon } =
    useGetFavouritePokemon(favouritePokemon);
  const onReachEnd = () => {
    if (hasNextPage && !isLoading) {
      fetchNextPage();
    }
  };
  const handleOpenBottomSheet = (pokemon: Pokemon) => {
    bottomSheetRef.current?.present();
    setBottomSheetPokemon(pokemon);
  };
  const handleAddToFavorite = (name: string) => {
    setFavouritePokemon(name);
  };
  const handleRemoveFavorite = () => {
    setFavouritePokemon(undefined);
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
    <>
      <SafeAreaView
        style={[
          styles.safeAreaView,
          { backgroundColor: useThemeColor({}, "bgSoftPrimary") },
        ]}
        edges={["top"]}
      >
        <View style={[styles.header, { backgroundColor: "bgSoftPrimary" }]}>
          <Logo width={110} height={40}></Logo>
          <View
            style={[
              styles.settingsOutline,
              { backgroundColor: useThemeColor({}, "bgSoftSecondaryHover") },
            ]}
          >
            <SettingsIcon fill={useThemeColor({}, "bgStrongPrimary")} />
          </View>
        </View>
        {favouritePokemonData && (
          <FavouritePokemon
            pokemon={favouritePokemonData}
            handleRemove={handleRemoveFavorite}
            handleOpenBottomSheet={handleOpenBottomSheet}
          />
        )}
      </SafeAreaView>
      <View
        style={[
          styles.container,
          { backgroundColor: useThemeColor({}, "bgSoftSecondary") },
        ]}
      >
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
          <View
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
              style={[
                styles.input,
                { color: useThemeColor({}, "textDefaultPrimary") },
              ]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search a pokemon..."
              placeholderTextColor={useThemeColor({}, "textDefaultSecondary")}
            />
          </View>
          {filteredPokemonData ? (
            <FlatList<Pokemon>
              data={filteredPokemonData}
              style={styles.itemsContainer}
              renderItem={({ item, index }) => (
                <PokemonItem
                  pokemon={item}
                  index={index + 1}
                  onPress={() => {
                    handleOpenBottomSheet(item);
                  }}
                />
              )}
              onEndReached={onReachEnd}
              onEndReachedThreshold={0.5}
            />
          ) : (
            <View>
              <Text>Loading...</Text>
            </View>
          )}
        </View>
      </View>
      <BottomSheet ref={bottomSheetRef}>
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
  container: {
    flex: 1,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  header: {
    height: 80,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  safeAreaView: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerImage: {
    width: 100,
    height: 100,
  },
  settingsOutline: {
    padding: 10,
    marginLeft: "auto",
    borderRadius: "50%",
  },
  pokeTextContainer: {
    display: "flex",
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
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
  },
  input: {},
  itemsContainer: {
    marginBottom: 10,
  },
});
