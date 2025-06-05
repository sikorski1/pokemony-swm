import CameraIconSolid from "@/assets/icons/camera-solid.svg";
import CameraIcon from "@/assets/icons/camera.svg";
import HomeIconSolid from "@/assets/icons/home-solid.svg";
import HomeIcon from "@/assets/icons/home.svg";
import MapIconSolid from "@/assets/icons/map-solid.svg";
import MapIcon from "@/assets/icons/map.svg";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Tabs } from "expo-router";
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: useThemeColor({}, "bgSoftPrimary"),
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
              <HomeIconSolid
                width={24}
                height={24}
                fill={useThemeColor({}, "textDefaultPrimary")}
              />
            ) : (
              <HomeIcon
                width={24}
                height={24}
                fill={useThemeColor({}, "textDefaultPrimary")}
              />
            ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Camera",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <CameraIconSolid
                width={24}
                height={24}
                fill={useThemeColor({}, "textDefaultPrimary")}
              />
            ) : (
              <CameraIcon
                width={24}
                height={24}
                fill={useThemeColor({}, "textDefaultPrimary")}
              />
            ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MapIconSolid
                width={24}
                height={24}
                fill={useThemeColor({}, "textDefaultPrimary")}
              />
            ) : (
              <MapIcon
                width={24}
                height={24}
                fill={useThemeColor({}, "textDefaultPrimary")}
              />
            ),
        }}
      />
    </Tabs>
  );
}
