import Heart from "@/assets/icons/heart-solid.svg";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Pokemon } from "@/types/pokemon";
import { PlatformPressable } from "@react-navigation/elements";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  pokemon: Pokemon;
  handleRemove: () => void;
  handleOpenBottomSheet: (pokemon: Pokemon) => void;
};
export default function FavouritePokemon({
  pokemon,
  handleRemove,
  handleOpenBottomSheet,
}: Props) {
  return (
    <View
      style={[
        styles.container,
        { borderColor: useThemeColor({}, "borderSoft") },
      ]}
    >
      <View style={[styles.headerContainer]}>
        <View
          style={[
            styles.imageBox,
            { borderColor: useThemeColor({}, "borderSoft") },
          ]}
        >
          <Image
            style={[styles.image]}
            source={pokemon.image}
            contentFit="cover"
            transition={1000}
          />
          <View
            style={[
              styles.imageIcon,
              { backgroundColor: useThemeColor({}, "favorite") },
            ]}
          >
            <Heart
              width={24}
              height={24}
              fill={useThemeColor({}, "textDefaultPrimary")}
            />
          </View>
        </View>
        <View style={[styles.textBox]}>
          <Text
            style={[
              styles.favouritePokemonText,
              { color: useThemeColor({}, "textDefaultTertiary") },
            ]}
          >
            your favorite pokemon
          </Text>
          <Text
            style={[
              styles.favouritePokemonName,
              { color: useThemeColor({}, "textDefaultPrimary") },
            ]}
          >
            {pokemon.name}
          </Text>
        </View>
      </View>
      <View style={[styles.buttonsBox]}>
        <PlatformPressable
          style={[
            styles.btns,
            {
              backgroundColor: useThemeColor({}, "bgStrongPrimary"),
            },
          ]}
          onPress={() => handleOpenBottomSheet(pokemon)}
        >
          <Text
            style={[
              styles.text,
              { color: useThemeColor({}, "textContrastPrimary") },
            ]}
          >
            See details
          </Text>
        </PlatformPressable>
        <PlatformPressable
          style={[
            styles.btns,
            { backgroundColor: useThemeColor({}, "bgStrongSecondary") },
          ]}
          onPress={handleRemove}
        >
          <Text
            style={[
              styles.text,
              { color: useThemeColor({}, "textDefaultPrimary") },
            ]}
          >
            Remove
          </Text>
        </PlatformPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 800,
    alignSelf: "center",
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  headerContainer: {
    flexDirection: "row",
    gap: 16,
  },
  imageBox: {
    width: 124,
    height: 124,
    borderWidth: 1,
    padding: 4,
    borderRadius: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageIcon: {
    position: "absolute",
    top: -12,
    right: -12,
    padding: 4,
    borderRadius: "100%",
  },
  textBox: {
    gap: 4,
  },
  favouritePokemonText: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    lineHeight: 16,
    fontWeight: "500",
  },
  favouritePokemonName: {
    fontSize: 20,
    textTransform: "capitalize",
    fontWeight: "bold",
  },
  buttonsBox: {
    justifyContent: "center",
    gap: 8,
  },
  btns: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 40,
    minHeight: 40,
    borderRadius: 9999,
  },
  text: {
    fontWeight: "bold",
  },
});
