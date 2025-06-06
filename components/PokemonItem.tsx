import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Pokemon } from "@/types/pokemon";
import { PlatformPressable } from "@react-navigation/elements";
import { Image } from "expo-image";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
type Props = {
  pokemon: Pokemon;
  index: number;
  onPress: () => void;
};
export default function PokemonItem({ pokemon, index, onPress }: Props) {
  const theme = useColorScheme();
  return (
    <PlatformPressable
      style={[
        styles.cardContainer,
        {
          backgroundColor: useThemeColor({}, "bgSoftPrimary"),
          borderColor: useThemeColor({}, "bgStrongSecondary"),
        },
      ]}
      key={pokemon.name}
      onPress={onPress}
    >
      <Image
        style={[
          styles.image,
          {
            backgroundColor: useThemeColor({}, "bgSoftPrimary"),
            borderColor: useThemeColor({}, "bgStrongSecondary"),
          },
        ]}
        source={pokemon.image}
        contentFit="cover"
        transition={1000}
      ></Image>
      <View style={[styles.pokemonInfoContainer]}>
        <Text
          style={[
            styles.pokemonName,
            { color: useThemeColor({}, "textDefaultPrimary") },
          ]}
        >
          {pokemon.name}
        </Text>
        <Text
          style={[
            styles.pokemonIndex,
            { color: useThemeColor({}, "textDefaultTertiary") },
          ]}
        >
          {index.toString().padStart(3, "0")}
        </Text>
      </View>
      <View style={styles.pokemonTypeBox}>
        {pokemon.types.map((type) => {
          const colorType =
            "type" + type.charAt(0).toUpperCase() + type.slice(1);
          return (
            <View
              key={type}
              style={[
                styles.pokemonType,
                { backgroundColor: Colors[theme ?? "light"][colorType] },
              ]}
            />
          );
        })}
      </View>
    </PlatformPressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  image: {
    marginRight: 12,
    width: 48,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
  },
  pokemonInfoContainer: {
    justifyContent: "space-evenly",
  },
  pokemonName: {
    textTransform: "capitalize",
    fontWeight: "bold",
    fontSize: 16,
  },
  pokemonIndex: {
    fontSize: 12,
  },
  pokemonTypeBox: {
    marginLeft: "auto",
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
    gap: 8,
  },
  pokemonType: {
    width: 20,
    height: 20,
    borderRadius: "50%",
  },
});
