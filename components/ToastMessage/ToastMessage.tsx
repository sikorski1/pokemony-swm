import { Colors } from "@/constants/Colors";
import { PlatformPressable } from "@react-navigation/elements";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import Toast from "react-native-toast-message";
export default function ToastMessage() {
  const theme = useColorScheme();
  return (
    <Toast
      config={{
        success: ({ text1 }) => (
          <View
            style={[
              styles.container,
              {
                backgroundColor: Colors[theme || "light"]["bgSoftPrimary"],
                borderColor: Colors[theme || "light"]["borderSoft"],
                shadowColor:
                  Colors[theme || "light"]["bgStrongSecondaryClicked"],
              },
            ]}
          >
            <View
              style={[
                styles.successStripe,
                { backgroundColor: Colors[theme || "light"]["bgGreenPrimary"] },
              ]}
            />
            <Text
              style={[
                styles.text1,
                { color: Colors[theme || "light"]["textDefaultPrimary"] },
              ]}
            >
              {text1}
            </Text>
          </View>
        ),
        error: ({ text1, text2 }) => (
          <View
            style={[
              styles.container,
              {
                backgroundColor: Colors[theme || "light"]["bgSoftPrimary"],
                borderColor: Colors[theme || "light"]["borderSoft"],
                shadowColor:
                  Colors[theme || "light"]["bgStrongSecondaryClicked"],
              },
            ]}
          >
            <View
              style={[
                styles.successStripe,
                { backgroundColor: Colors[theme || "light"]["bgRedPrimary"] },
              ]}
            />
            <Text
              style={[
                styles.text1,
                { color: Colors[theme || "light"]["textDefaultPrimary"] },
              ]}
            >
              {text1}
            </Text>
            <Text
              style={[
                styles.text2,
                { color: Colors[theme || "light"]["textDefaultPrimary"] },
              ]}
            >
              {text2}
            </Text>
          </View>
        ),
        saveButton: ({ text1, onPress }) => (
          <View
            style={[
              styles.container,
              {
                backgroundColor: Colors[theme || "light"]["bgSoftPrimary"],
                borderColor: Colors[theme || "light"]["borderSoft"],
                shadowColor:
                  Colors[theme || "light"]["bgStrongSecondaryClicked"],
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              },
            ]}
          >
            <View
              style={[
                styles.successStripe,
                {
                  backgroundColor: Colors[theme || "light"]["bgOrangePrimary"],
                },
              ]}
            />
            <Text
              style={[
                styles.text1,
                {
                  color: Colors[theme || "light"]["textDefaultPrimary"],
                  flex: 1,
                },
              ]}
            >
              {text1}
            </Text>
            <PlatformPressable
              onPress={onPress}
              style={[
                styles.button,
                {
                  backgroundColor: Colors[theme || "light"]["bgOrangePrimary"],
                },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: Colors[theme || "light"]["textContrastPrimary"] },
                ]}
              >
                Catch
              </Text>
            </PlatformPressable>
          </View>
        ),
      }}
      topOffset={60}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 16,
    width: 320,
    borderWidth: 1,
    borderRadius: 8,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    elevation: 6,
  },
  successStripe: {
    position: "absolute",
    width: 6,
    top: 0,
    bottom: 0,
    left: 0,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  text1: {
    fontSize: 16,
    fontWeight: "bold",
    flexShrink: 1,
  },
  text2: {
    fontSize: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: "bold",
  },
});
