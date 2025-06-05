import Search from "@/assets/icons/search.svg";
import SettingsIcon from "@/assets/icons/settings.svg";
import Logo from "@/assets/images/favicon.svg";
import BottomSheet from "@/components/BottomSheet";
import PokemonItem from "@/components/PokemonItem";
import { useGetPokemons } from "@/hooks/usePokemon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Pokemon } from "@/types/pokemon";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMemo, useRef } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function PokemonList() {
  const { data, isLoading, error, hasNextPage, fetchNextPage } =
    useGetPokemons();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const onReachEnd = () => {
    if (hasNextPage && !isLoading) {
      fetchNextPage();
    }
  };
  const { pokemonData, pokemonCount } = useMemo<{
    pokemonData: Pokemon[];
    pokemonCount: number;
  }>(() => {
    return {
      pokemonData: data?.pages?.flatMap((page) => page.detailedResponse) ?? [],
      pokemonCount: data?.pages[0].count,
    };
  }, [data]);
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
              { backgroundColor: useThemeColor({}, "bgSoftPrimary") },
            ]}
          >
            <Search fill={useThemeColor({}, "textDefaultPrimary")} />
            <TextInput
              style={[styles.input]}
              placeholder="Search a pokemon..."
              placeholderTextColor={useThemeColor({}, "textDefaultSecondary")}
            />
          </View>
          {pokemonData ? (
            <FlatList<Pokemon>
              data={pokemonData}
              style={styles.itemsContainer}
              renderItem={({ item, index }) => (
                <PokemonItem
                  pokemon={item}
                  index={index}
                  onPress={() => {
                    bottomSheetRef.current?.present();
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
      <BottomSheet ref={bottomSheetRef} />
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
    paddingHorizontal: 20,
    height: 80,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  safeAreaView: {
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
  },
  input: {},
  itemsContainer: {
    marginBottom: 10,
  },
});
