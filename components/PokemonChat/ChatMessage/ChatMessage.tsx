import { Colors, ThemeColorKey } from "@/constants/Colors";
import { StyleSheet, Text } from "react-native";
import { MessageRole } from "react-native-executorch";
import Animated, { SlideInDown } from "react-native-reanimated";
type Props = {
  message: { id: string; role?: MessageRole; content?: string };
  theme: "dark" | "light";
  pokemonBoxColor: ThemeColorKey;
};
export default function ChatMessage({
  message,
  theme,
  pokemonBoxColor,
}: Props) {
  return (
    <Animated.View
      entering={SlideInDown.duration(200).springify().damping(60).mass(1)}
      style={[
        styles.messageBox,
        message.role === "user"
          ? {
              ...styles.userBox,
              backgroundColor:
                Colors[theme === "light" ? "dark" : "light"][pokemonBoxColor],
            }
          : {
              ...styles.pokemonBox,
              backgroundColor: Colors[theme]["bgStrongSecondary"],
            },
      ]}
    >
      <Text
        style={[
          styles.messageText,
          {
            color: Colors[theme || "light"]["textDefaultPrimary"],
          },
        ]}
      >
        {message.content}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  messageBox: {
    padding: 12,
    marginVertical: 8,
    maxWidth: "80%",
  },
  userBox: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
  },
  pokemonBox: {
    alignSelf: "flex-start",
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  messageText: {
    fontSize: 14,
  },
});
