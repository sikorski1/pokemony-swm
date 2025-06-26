import TypingIndicator from "@/components/TypingIndicator/TypingIndicator";
import { Colors, ThemeColorKey } from "@/constants/Colors";
import { useLLMInstance } from "@/context/LlmProvider";
import { Pokemon } from "@/types/pokemon";
import { useEffect, useMemo, useRef } from "react";
import { FlatList, StyleSheet, Text, useColorScheme, View } from "react-native";
import ChatMessage from "../ChatMessage/ChatMessage";
type Props = {
  pokemon: Pokemon;
};

export default function ChatList({ pokemon }: Props) {
  const flatListRef = useRef<FlatList>(null);
  const llm = useLLMInstance();
  const theme = useColorScheme();
  const colorType = ("type" +
    pokemon.types[0].charAt(0).toUpperCase() +
    pokemon.types[0].slice(1)) as ThemeColorKey;
  const displayedMessages = useMemo(() => {
    if (!llm) return [];
    if (llm.isGenerating) {
      return [...llm.messageHistory, { role: "typing", content: "typing" }];
    }
    return llm.messageHistory;
  }, [llm?.messageHistory, llm?.isGenerating]);
  useEffect(() => {
    if (!llm) return;
    llm.configurePokemon(pokemon);
  }, [pokemon]);
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [llm?.messageHistory]);
  return llm?.messageHistory.length !== 0 ? (
    <FlatList
      ref={flatListRef}
      style={[styles.chatContainer]}
      data={displayedMessages}
      renderItem={({ item }) => {
        if (item.role === "typing") {
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
      keyExtractor={(item) => `${item.content}`}
    />
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
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    width: "100%",
    maxHeight: 600,
    minHeight: 200,
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
