import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Pokemon } from "@/types/pokemon";
import { PlatformPressable } from "@react-navigation/elements";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
type Props = {
  pokemon: Pokemon;
  onPress: () => void;
  theme: "light" | "dark";
};
export default function PokemonItem({ pokemon, onPress, theme }: Props) {
  const textColor = useThemeColor({}, "textDefaultPrimary");
  return (
    <PlatformPressable
      style={[
        styles.cardContainer,
        {
          backgroundColor: Colors[theme ?? "light"]["bgSoftPrimary"],
          borderColor: Colors[theme ?? "light"]["bgStrongSecondary"],
        },
      ]}
      key={pokemon.name}
      onPress={onPress}
    >
      <Image
        style={[
          styles.image,
          {
            backgroundColor: Colors[theme ?? "light"]["bgSoftPrimary"],
            borderColor: Colors[theme ?? "light"]["bgStrongSecondary"],
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
            { color: Colors[theme ?? "light"]["textDefaultPrimary"] },
          ]}
        >
          {pokemon.name}
        </Text>
        <Text
          style={[
            styles.pokemonIndex,
            { color: Colors[theme ?? "light"]["textDefaultTertiary"] },
          ]}
        >
          {pokemon.id.toString().padStart(3, "0")}
        </Text>
      </View>
      <View style={styles.pokemonTypeBox}>
        {pokemon.types.map((type) => {
          const colorType =
            "type" + type.charAt(0).toUpperCase() + type.slice(1);
          return (
            <View
              style={[
                styles.pokemonType,
                {
                  backgroundColor: Colors[theme ?? "light"]["bgSoftSecondary"],
                },
              ]}
              key={type}
            >
              <View
                style={[
                  styles.typeCircle,
                  { backgroundColor: Colors[theme ?? "light"][colorType] },
                ]}
              />
              <Text style={[styles.type, { color: textColor }]}>{type}</Text>
            </View>
          );
        })}
      </View>
    </PlatformPressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    maxWidth: "24%",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 12,
    borderWidth: 1,
    gap: 16,
  },
  image: {
    width: 164,
    height: 164,
    alignSelf: "center",
  },
  pokemonInfoContainer: {
    alignItems: "center",
    gap: 8,
  },
  pokemonName: {
    fontSize: 20,
    textTransform: "capitalize",
  },
  pokemonIndex: {
    fontSize: 16,
  },
  pokemonTypeBox: { flexDirection: "row", justifyContent: "space-evenly" },
  pokemonType: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingRight: 8,
    paddingLeft: 4,
    gap: 8,
    borderRadius: 9999,
  },
  typeCircle: { width: 24, height: 24, borderRadius: "50%" },
  type: { textTransform: "capitalize", fontSize: 16 },
});
