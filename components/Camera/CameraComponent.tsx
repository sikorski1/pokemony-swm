import { Text, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
export default function CameraComponent() {
  return (
    <View>
      <Text style={{ color: useThemeColor({}, "textDefaultPrimary") }}>Camera is not supported on web.</Text>
    </View>
  );
}
