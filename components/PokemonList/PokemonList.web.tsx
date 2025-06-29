import { BottomSheetType, Pokemon } from "@/types/pokemon";
import { FlatList, StyleSheet, useColorScheme } from "react-native";
import PokemonItem from "../PokemonItem/PokemonItem.web";
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
      numColumns={4}
      contentContainerStyle={{ gap: 16 }}
      columnWrapperStyle={{ gap: 16 }}
      renderItem={({ item }) => (
        <PokemonItem
          pokemon={item}
          onPress={() => {
            handleOpenBottomSheet(item, "singlePokemon");
          }}
          theme={theme || "light"}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={onReachEnd}
      onEndReachedThreshold={0.5}
    />
  );
}
const styles = StyleSheet.create({
  itemsContainer: {
    flex: 4,
  },
});
