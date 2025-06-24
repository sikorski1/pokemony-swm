import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Pokemon } from "@/types/pokemon";
import { Image } from "expo-image";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
type Props = {
  pokemon: Pokemon;
};
type ChatMessage = {
  sender: "user" | "pokemon";
  message: string;
};
const sampleMessages: ChatMessage[] = [
  { sender: "user", message: "Hej Pikachu! Jak się dziś czujesz?" },
  { sender: "pokemon", message: "Pika pika! ⚡️ Dzisiaj mam dużo energii!" },
  { sender: "user", message: "Gotowy na walkę?" },
  { sender: "pokemon", message: "Pika! Zawsze jestem gotowy!" },
  { sender: "user", message: "Kto był Twoim najtrudniejszym przeciwnikiem?" },
  { sender: "pokemon", message: "Pika... Charizard był naprawdę silny!" },
  { sender: "user", message: "Wow, brzmi poważnie. Dzięki za rozmowę!" },
  { sender: "pokemon", message: "Pika pika! ⚡️ Zawsze do usług!" },
];
export default function PokemonChat({ pokemon }: Props) {
  const theme = useColorScheme();
  return (
    <SafeAreaView style={[styles.container]} edges={["bottom"]}>
      <View style={[styles.headerContainer]}>
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
            { color: useThemeColor({}, "textDefaultPrimary") },
          ]}
        >
          {pokemon.name}
        </Text>
      </View>
      <ScrollView style={[styles.chatContainer]}>
        {sampleMessages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.sender === "user" ? styles.userBubble : styles.pokemonBubble,
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
              {msg.message}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 12,
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
  },
  messageBubble: {
    padding: 10,
    marginVertical: 4,
    maxWidth: "80%",
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: "#d0f0ff",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  pokemonBubble: {
    backgroundColor: "#ffe7b3",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 14,
  },
});
