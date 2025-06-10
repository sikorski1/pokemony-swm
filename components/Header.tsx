import SettingsIcon from "@/assets/icons/settings.svg";
import Logo from "@/assets/images/favicon.svg";
import { useGetFavouritePokemon } from "@/hooks/usePokemon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Pokemon } from "@/types/pokemon";
import { StyleSheet, View } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { SafeAreaView } from "react-native-safe-area-context";
import FavouritePokemon from "./FavouritePokemon";
type Props = {
  handleOpenBottomSheet: (pokemon: Pokemon) => void;
};
export default function Header({ handleOpenBottomSheet }: Props) {
  const [favouritePokemon, setFavouritePokemon] =
    useMMKVString("favouritePokemon");
  const { data: favouritePokemonData, isLoading: isLoadingFavouritePokemon } =
    useGetFavouritePokemon(favouritePokemon);
  const handleRemoveFavorite = () => {
    setFavouritePokemon(undefined);
  };
  return (
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
      {favouritePokemonData && (
        <FavouritePokemon
          pokemon={favouritePokemonData}
          handleRemove={handleRemoveFavorite}
          handleOpenBottomSheet={handleOpenBottomSheet}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});
