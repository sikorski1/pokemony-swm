import { Pokemon } from "@/types/pokemon";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
type Props = {
  pokemon: Pokemon;
};
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
export default function PokemonItem({ pokemon }: Props) {
  return (
    <View style={styles.cardContainer} key={pokemon.name}>
      <Image
        style={styles.image}
        source={pokemon.image}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      ></Image>
      <Text>{pokemon.name}</Text>
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
  image: {
    width: 50,
    height: 50,
    backgroundColor: "#333",
  },
});
