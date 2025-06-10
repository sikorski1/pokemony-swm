import Search from "@/assets/icons/search.svg";
import BottomSheet from "@/components/BottomSheet";
import BottomSheetContent from "@/components/BottomSheetContent";
import Header from "@/components/Header";
import PokemonItem from "@/components/PokemonItem";
import Wrapper from "@/components/Wrapper";
import { useGetPokemons } from "@/hooks/usePokemon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Pokemon } from "@/types/pokemon";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useMMKVString } from "react-native-mmkv";
export default function PokemonList() {
  const textInput = useRef<TextInput>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [_, setFavouritePokemon] = useMMKVString("favouritePokemon");
  const [bottomSheetPokemon, setBottomSheetPokemon] = useState<Pokemon | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data, isLoading, error, hasNextPage, fetchNextPage } =
    useGetPokemons();
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
      </Wrapper>
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
    alignItems: "center",
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
  },
  input: {
    outlineWidth: 0,
  },
  itemsContainer: {
    maxHeight: 640,
    marginBottom: 10,
  },
});
