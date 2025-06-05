import { Tabs } from "expo-router";
export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Favourite Pokemon" }} />
      <Tabs.Screen name="list" options={{ title: "Pokemon List" }} />
      <Tabs.Screen name="map" options={{ title: "Pokemon Map" }} />
    </Tabs>
  );
}
