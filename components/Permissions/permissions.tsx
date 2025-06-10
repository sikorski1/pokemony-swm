import { Text, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
export default function PermissionsComponent() {
  return (
    <View>
      <Text style={{ color: useThemeColor({}, "textDefaultPrimary") }}>
        App needs access to a few permissions in order to work properly.
      </Text>
    </View>
  );
}
