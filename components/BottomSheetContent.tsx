import Attack from "@/assets/icons/attack.svg";
import Defense from "@/assets/icons/defense.svg";
import Hp from "@/assets/icons/hp.svg";
import Speed from "@/assets/icons/speed.svg";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Pokemon, StatKey } from "@/types/pokemon";
import { PlatformPressable } from "@react-navigation/elements";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QrCode from "./QrCode/QrCode";
type Props = {
  pokemon: Pokemon;
  handleAddToFavorite: (name: string) => void;
};
const iconMap: Record<StatKey, React.ReactElement> = {
  hp: <Hp />,
  speed: <Speed />,
  attack: <Attack />,
  "special-attack": <Attack />,
  defense: <Defense />,
  "special-defense": <Defense />,
};
export default function BottomSheetContent({
  pokemon,
  handleAddToFavorite,
}: Props) {
  const theme = useColorScheme();
  const textColor = useThemeColor({}, "textDefaultPrimary");
  return (
    <SafeAreaView style={[styles.container]} edges={["bottom"]}>
      <View style={[styles.headerContainer]}>
        <Text style={[styles.headerName, { color: textColor }]}>
          {pokemon.name}
        </Text>
        <View style={[styles.headerTypesBox]}>
          {pokemon.types.map((type: string) => {
            const colorType =
              "type" + type.charAt(0).toUpperCase() + type.slice(1);
            return (
              <View
                style={[
                  styles.headerTypeBox,
                  { backgroundColor: useThemeColor({}, "bgSoftSecondary") },
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
      </View>
      <Image
        style={[styles.pokemonImg]}
        source={pokemon.image}
        contentFit="cover"
        transition={1000}
      />
      <View style={[styles.statsContainer]}>
        {pokemon.stats.map((stat, index) => (
          <View style={[styles.statBoxWithUnderline]} key={stat.name}>
            <View style={[styles.statBox]}>
              <Text style={[styles.statName, { color: textColor }]}>
                {stat.name}
              </Text>
              <View style={[styles.bestStatBox]}>
                <Text style={[styles.bestStat, { color: textColor }]}>
                  {stat.base_stat}
                </Text>
                {iconMap[stat.name]}
              </View>
            </View>
            {index % 2 === 1 &&
            index !== 0 &&
            index !== pokemon.stats.length - 1 ? (
              <View
                style={[
                  styles.underline,
                  { backgroundColor: useThemeColor({}, "borderSoft") },
                ]}
              />
            ) : null}
          </View>
        ))}
      </View>
      <PlatformPressable
        style={[
          styles.addToFavouritesBtn,
          { backgroundColor: useThemeColor({}, "bgStrongPrimary") },
        ]}
        onPress={() => handleAddToFavorite(pokemon.name)}
      >
        <Text
          style={[
            styles.addToFavouritesBtnText,
            { color: useThemeColor({}, "textContrastPrimary") },
          ]}
        >
          Add to favorite
        </Text>
      </PlatformPressable>
      <QrCode deepLink={`pokemony:///?name=${pokemon.name}`} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  headerContainer: {
    gap: 12,
  },
  headerName: {
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "capitalize",
    fontSize: 26,
  },
  headerTypesBox: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  headerTypeBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingRight: 8,
    paddingLeft: 4,
    gap: 8,
    borderRadius: 9999,
  },
  typeCircle: { width: 24, height: 24, borderRadius: "50%" },
  type: {
    textTransform: "capitalize",
    fontSize: 16,
  },
  pokemonImg: {
    width: 192,
    height: 192,
  },
  statsContainer: {
    width: "100%",
    gap: 16,
  },
  statBoxWithUnderline: {
    gap: 16,
  },
  statBox: {
    flexDirection: "row",
  },
  statName: {
    fontSize: 16,
    fontWeight: "semibold",
    textTransform: "capitalize",
  },
  bestStatBox: {
    marginLeft: "auto",
    flexDirection: "row",
    gap: 6,
  },
  bestStat: {
    fontSize: 16,
    fontWeight: "bold",
  },
  underline: {
    height: 1,
  },
  addToFavouritesBtn: {
    width: "100%",
    minHeight: 40,
    height: 40,
    marginTop: 24,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  addToFavouritesBtnText: {
    fontSize: 16,
  },
});
