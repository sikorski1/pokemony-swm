import { Colors, ThemeColorKey } from "@/constants/Colors";
import { StyleSheet, useColorScheme, View } from "react-native";
import Dot from "./Dot";
type Props = {
  pokemonType: ThemeColorKey;
};
export default function TypingIndicator({ pokemonType }: Props) {
  const theme = useColorScheme();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[theme || "light"]["bgStrongSecondary"] },
      ]}
    >
      <Dot delay={0} pokemonType={pokemonType} theme={theme || "light"} />
      <Dot delay={200} pokemonType={pokemonType} theme={theme || "light"} />
      <Dot delay={400} pokemonType={pokemonType} theme={theme || "light"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 6,
    padding: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
});
