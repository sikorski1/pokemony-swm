import CameraIconSolid from "@/assets/icons/camera-solid.svg";
import CameraIcon from "@/assets/icons/camera.svg";
import HomeIconSolid from "@/assets/icons/home-solid.svg";
import HomeIcon from "@/assets/icons/home.svg";
import MapIconSolid from "@/assets/icons/map-solid.svg";
import MapIcon from "@/assets/icons/map.svg";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
export default function TabLayout() {
  const iconColor = useThemeColor({}, "textDefaultPrimary");
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: useThemeColor({}, "bgSoftPrimary"),
          maxWidth: 1200,
          display: Platform.OS === "web" ? "none" : "flex",
        },
        tabBarActiveTintColor: useThemeColor({}, "textDefaultPrimary"),
        tabBarInactiveTintColor: useThemeColor({}, "textDefaultSecondary"),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <HomeIconSolid width={24} height={24} fill={iconColor} />
            ) : (
              <HomeIcon width={24} height={24} fill={iconColor} />
            ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Camera",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <CameraIconSolid width={24} height={24} fill={iconColor} />
            ) : (
              <CameraIcon width={24} height={24} fill={iconColor} />
            ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MapIconSolid width={24} height={24} fill={iconColor} />
            ) : (
              <MapIcon width={24} height={24} fill={iconColor} />
            ),
        }}
      />
    </Tabs>
  );
}
