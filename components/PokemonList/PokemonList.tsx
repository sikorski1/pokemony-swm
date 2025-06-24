import { BottomSheetType, Pokemon } from "@/types/pokemon";
import { FlatList, StyleSheet, useColorScheme } from "react-native";
import PokemonItem from "../PokemonItem/PokemonItem";
type Props = {
  filteredPokemonData: Pokemon[];
  handleOpenBottomSheet: (pokemon: Pokemon, type: BottomSheetType) => void;
  onReachEnd: () => void;
};
export default function PokemonList({
  filteredPokemonData,
  onReachEnd,
  handleOpenBottomSheet,
}: Props) {
  const theme = useColorScheme();
  return (
    <FlatList<Pokemon>
      data={filteredPokemonData}
      style={[styles.itemsContainer]}
      renderItem={({ item }) => (
        <PokemonItem
          pokemon={item}
          onPress={() => {
            handleOpenBottomSheet(item, "singlePokemon");
          }}
          theme={theme || "light"}
        />
      )}
      onEndReached={onReachEnd}
      onEndReachedThreshold={0.5}
    />
  );
}
const styles = StyleSheet.create({
  itemsContainer: {
    flex: 1,
  },
});
