import { useThemeColor } from "@/hooks/useThemeColor";
import { Redirect } from "expo-router";
import { Text, View } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
export default function CameraComponent() {
  const { hasPermission } = useCameraPermission();
  const microphonePermission = Camera.getMicrophonePermissionStatus();
  const redirectToPermissions =
    !hasPermission || microphonePermission !== "not-determined";
  const device = useCameraDevice("back");
  if (redirectToPermissions) return <Redirect href={"/permissions"} />;
  if (!device) return <></>;
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: useThemeColor({}, "textDefaultPrimary") }}>
        Favourite Pokemon
      </Text>
    </View>
  );
}
