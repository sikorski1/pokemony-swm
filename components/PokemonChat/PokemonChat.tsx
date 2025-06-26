import RightArrow from "@/assets/icons/arrow-right.svg";
import { Colors, ThemeColorKey } from "@/constants/Colors";
import { useLLMInstance } from "@/context/LlmProvider";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Pokemon } from "@/types/pokemon";
import { PlatformPressable } from "@react-navigation/elements";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { MessageRole } from "react-native-executorch";
import * as Progress from "react-native-progress";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatList from "./ChatList/ChatList";
type Props = {
  pokemon: Pokemon;
};
type ChatMessageType = {
  id: string;
  role?: MessageRole;
  content?: string;
};
export default function PokemonChat({ pokemon }: Props) {
  const flatListRef = useRef<FlatList>(null);
  const [messageText, setMessageText] = useState<string>("");
  const llm = useLLMInstance();
  const theme = useColorScheme();
  const colorType = ("type" +
    pokemon.types[0].charAt(0).toUpperCase() +
    pokemon.types[0].slice(1)) as ThemeColorKey;
  const handleMessageSend = async (value: Omit<ChatMessageType, "id">) => {
    if (llm && llm.isReady && value.content) {
      setMessageText("");
      await llm.sendMessage(value.content);
    }
  };
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [llm?.messageHistory]);
  return (
    <SafeAreaView style={[styles.container]} edges={["bottom"]}>
      <View
        style={[
          styles.headerContainer,
          { borderBottomColor: useThemeColor({}, "borderSoft") },
        ]}
      >
        <View
          style={[
            styles.imageBox,
            { borderColor: useThemeColor({}, "borderSoft") },
          ]}
        >
          <Image
            style={[styles.image]}
            source={pokemon.image}
            contentFit="cover"
            transition={1000}
          />
        </View>
        <Text
          style={[
            styles.pokemonName,
            { color: Colors[theme || "light"][colorType as ThemeColorKey] },
          ]}
        >
          {pokemon.name}
        </Text>
      </View>
      <ChatList pokemon={pokemon} />
      <View
        style={[
          styles.textInputBox,
          { borderTopColor: useThemeColor({}, "borderSoft") },
        ]}
      >
        <TextInput
          style={[
            styles.messageInput,
            { color: useThemeColor({}, "textDefaultPrimary") },
            { backgroundColor: useThemeColor({}, "bgSoftSecondaryClicked") },
          ]}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Message"
          placeholderTextColor={useThemeColor({}, "textDefaultSecondary")}
        />
        <PlatformPressable
          onPress={() =>
            handleMessageSend({ role: "user", content: messageText })
          }
          disabled={messageText.trim() === "" || !llm?.isReady}
        >
          <RightArrow
            width={28}
            height={28}
            fill={useThemeColor({}, colorType)}
          />
        </PlatformPressable>
      </View>
      {!llm?.isReady && llm?.downloadProgress === 0 && <ActivityIndicator />}
      {!llm?.isReady && llm?.downloadProgress !== 0 && (
        <Progress.Circle progress={llm?.downloadProgress} showsText={true} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 12,
    borderBottomWidth: 1,
  },
  imageBox: {
    width: 60,
    height: 60,
    borderWidth: 1,
    padding: 4,
    borderRadius: 9999,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  pokemonName: {
    fontSize: 16,
    textTransform: "capitalize",
    fontWeight: "bold",
  },
  textInputBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    width: "100%",
    borderTopWidth: 1,
    gap: 12,
  },
  messageInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 9999,
  },
});
