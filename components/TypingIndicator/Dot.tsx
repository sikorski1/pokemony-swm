import { Colors, ThemeColorKey } from "@/constants/Colors";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
type Props = {
  delay: number;
  pokemonType: ThemeColorKey;
  theme: "dark" | "light";
};
export default function Dot({ delay, pokemonType, theme }: Props) {
  const opacity = useSharedValue(0.3);
  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 400,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      ),
    );
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: opacity.value }],
  }));
  return (
    <Animated.View
      style={[
        styles.dot,
        animatedStyle,
        { backgroundColor: Colors[theme][pokemonType] },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
