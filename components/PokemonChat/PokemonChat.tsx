import RightArrow from "@/assets/icons/arrow-right.svg";
import { Colors, ThemeColorKey } from "@/constants/Colors";
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
import {
  LLAMA3_2_1B,
  LLAMA3_2_TOKENIZER,
  LLAMA3_2_TOKENIZER_CONFIG,
  LLMTool,
  MessageRole,
  useLLM,
} from "react-native-executorch";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatMessage from "../ChatMessage/ChatMessage";
import TypingIndicator from "../TypingIndicator/TypingIndicator";
type Props = {
  pokemon: Pokemon;
};
type ChatMessageType = {
  id: string;
  role?: MessageRole;
  content?: string;
};

const TOOL_DEFINITIONS: LLMTool[] = [
  {
    name: "get_pokemon_stats",
    description: "Returns base starts for a given Pokemon.",
    parameters: {
      type: "dict",
      properties: {
        name: {
          type: "string",
          description: "The name of the Pokémon",
        },
      },
      required: ["name"],
    },
  },
];
export default function PokemonChat({ pokemon }: Props) {
  console.log(pokemon);
  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [messageText, setMessageText] = useState<string>("");
  const llm = useLLM({
    modelSource: LLAMA3_2_1B,
    tokenizerSource: LLAMA3_2_TOKENIZER,
    tokenizerConfigSource: LLAMA3_2_TOKENIZER_CONFIG,
  });

  const theme = useColorScheme();
  const colorType = ("type" +
    pokemon.types[0].charAt(0).toUpperCase() +
    pokemon.types[0].slice(1)) as ThemeColorKey;
  const displayedMessages = llm.isGenerating
    ? [...messages, { id: "typing", type: "typing" }]
    : messages;
  const handleMessageSend = async (value: Omit<ChatMessageType, "id">) => {
    if (llm.isReady) {
      await llm.sendMessage(value.content!);
    }
  };
  useEffect(() => {
    llm.configure({
      chatConfig: {
        systemPrompt: `You are a Pokémon named ${pokemon.name}.
        You are a ${pokemon.types.join(" and ")}-type Pokémon.
        Your base stats are:
        - HP: ${pokemon.stats[0].base_stat}
        - Attack: ${pokemon.stats[2].base_stat}
        - Defense: ${pokemon.stats[4].base_stat}
        - Speed: ${pokemon.stats[1].base_stat}
        Stay in character and speak like a Pokémon.`,
      },
    });
  }, []);
  useEffect(() => {
    const response = llm.messageHistory.at(-1);
    if (response) {
      const newMessage: ChatMessageType = {
        id: Date.now().toString(),
        ...response,
      };
      setMessages((prev) => [...prev, newMessage]);
      if (newMessage.role === "user") setMessageText("");
    }
  }, [llm.messageHistory]);
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);
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
      {messages.length !== 0 ? (
        <>
          <FlatList
            ref={flatListRef}
            style={[styles.chatContainer]}
            data={displayedMessages}
            renderItem={({ item }) => {
              if (item.type === "typing") {
                return (
                  <View style={{ marginBottom: 8 }}>
                    <TypingIndicator pokemonType={colorType} />
                  </View>
                );
              }

              return (
                <ChatMessage
                  message={item}
                  theme={theme || "light"}
                  pokemonBoxColor={colorType as ThemeColorKey}
                />
              );
            }}
            keyExtractor={(item) => item.id}
          />
        </>
      ) : (
        <View style={[styles.firstMessageBox]}>
          <Text style={[styles.firstMessage]}>Say hello to </Text>
          <Text
            style={[
              styles.firstMessagePokemonName,
              { color: Colors[theme || "light"][colorType] },
            ]}
          >
            {pokemon.name}
          </Text>
        </View>
      )}
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
          disabled={messageText.trim() === "" || !llm.isReady}
        >
          <RightArrow
            width={28}
            height={28}
            fill={useThemeColor({}, colorType)}
          />
        </PlatformPressable>
      </View>
      {!llm.isReady && <ActivityIndicator />}
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
  chatContainer: {
    width: "100%",
    maxHeight: 600,
    minHeight: 200,
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
  firstMessageBox: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  firstMessage: {
    fontSize: 20,
  },
  firstMessagePokemonName: {
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
