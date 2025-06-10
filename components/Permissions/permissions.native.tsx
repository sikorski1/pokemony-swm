import NextArrow from "@/assets/icons/arrow-right.svg";
import BackArrow from "@/assets/icons/chevron-left.svg";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Switch } from "react-native-gesture-handler";
import { Camera, CameraPermissionStatus } from "react-native-vision-camera";
export default function PermissionsComponent() {
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");
  const [microphonePermissionStatus, setMicrophonePermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");
  const router = useRouter();
  const requestCameraPermission = async () => {
    const permissions = await Camera.requestCameraPermission();
    setCameraPermissionStatus(permissions);
  };
  const requestMicrophonePermission = async () => {
    const permissions = await Camera.requestMicrophonePermission();
    setMicrophonePermissionStatus(permissions);
  };
  const handleContinue = () => {
    if (
      cameraPermissionStatus === "granted" &&
      microphonePermissionStatus === "granted"
    ) {
      router.replace("/(tabs)/camera");
    } else {
      Alert.alert("Please go to settings and enable permissions.");
    }
  };
  const backIconColor = useThemeColor({}, "textDefaultPrimary");
  return (
    <>
      <Stack.Screen
        options={{
          title: "Permissions",
          headerLeft: () => (
            <BackArrow
              onPress={() => router.navigate("/")}
              fill={backIconColor}
            />
          ),
        }}
      />
      <View
        style={[
          styles.container,
          { backgroundColor: useThemeColor({}, "bgSoftPrimary") },
        ]}
      >
        <Text
          style={[
            styles.subtitle,
            { color: useThemeColor({}, "textDefaultPrimary") },
          ]}
        >
          App needs access to a few permissions in order to work properly.
        </Text>
        <View>
          <View>
            <Text
              style={[
                styles.subtitle,
                { color: useThemeColor({}, "textDefaultSecondary") },
              ]}
            >
              Camera: {cameraPermissionStatus}
            </Text>
            <Switch
              trackColor={{ true: "orange" }}
              value={cameraPermissionStatus === "granted"}
              onChange={requestCameraPermission}
            ></Switch>
          </View>
          <View>
            <Text
              style={[
                styles.subtitle,
                { color: useThemeColor({}, "textDefaultSecondary") },
              ]}
            >
              Microphone: {microphonePermissionStatus}
            </Text>
            <Switch
              trackColor={{ true: "orange" }}
              value={cameraPermissionStatus === "granted"}
              onChange={requestMicrophonePermission}
            ></Switch>
          </View>
        </View>
        <View>
          <NextArrow />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
});
