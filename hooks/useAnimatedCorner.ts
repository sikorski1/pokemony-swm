import { useEffect } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export function useAnimatedCorner(
  x?: number,
  y?: number,
  duration: number = 100,
) {
  const sharedX = useSharedValue(x ?? 0);
  const sharedY = useSharedValue(y ?? 0);
  useEffect(() => {
    if (x !== undefined) {
      sharedX.value = withTiming(x, { duration });
    }
    if (y !== undefined) {
      sharedY.value = withTiming(y, { duration });
    }
  }, [x, y, duration, sharedX, sharedY]);
  const animatedStyle = useAnimatedStyle(() => {
    return sharedX && sharedY
      ? {
          left: sharedX.value,
          top: sharedY.value,
        }
      : { borderWidth: 0 };
  });
  return animatedStyle;
}
