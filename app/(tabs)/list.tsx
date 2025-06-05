import PokemonItem from "@/components/PokemonItem";
import { useGetPokemons } from "@/hooks/usePokemon";
import { Pokemon } from "@/types/pokemon";
import { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
export default function PokemonList() {
  const { data, isLoading, error, hasNextPage, fetchNextPage } =
    useGetPokemons();
  const onReachEnd = () => {
    if (hasNextPage && !isLoading) {
      fetchNextPage();
    }
  };
  const pokemonData = useMemo<Pokemon[]>(
    () => data?.pages?.flatMap((page) => page) ?? [],
    [data],
  );
  return pokemonData ? (
    <View style={styles.container}>
      <FlatList<Pokemon>
        data={pokemonData}
        renderItem={({ item }) => <PokemonItem pokemon={item} />}
        onEndReached={onReachEnd}
        onEndReachedThreshold={0.5}
      />
    </View>
  ) : (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
  },
  cardContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "",
  },
});
