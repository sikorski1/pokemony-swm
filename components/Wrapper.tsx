import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, View } from "react-native";
export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: useThemeColor({}, "bgSoftSecondary") },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
    flex: 1,
  },
});
