import { Pokemon } from "@/types/pokemon";
import { createContext, ReactNode, useContext, useState } from "react";
import {
  LLMTool,
  LLMType,
  QWEN3_1_7B,
  QWEN3_TOKENIZER,
  QWEN3_TOKENIZER_CONFIG,
  useLLM,
} from "react-native-executorch";
type ExtendedLLMContext = LLMType & {
  configurePokemon: (pokemon: Pokemon) => void;
  clearPokemonConfig: () => void;
};

const TOOL_DEFINITIONS: LLMTool[] = [
  {
    name: "get_pokemon_attacks",
    description: "Returns base attacks for a given Pokemon.",
    parameters: {
      type: "dict",
      properties: {
        attacks: {
          type: "string",
          description:
            "Pokemon attacks when user wants to know pokemon attacks",
        },
      },
      required: ["attacks"],
    },
  },
];
const LLMContext = createContext<ExtendedLLMContext | null>(null);

export const LLMProvider = ({ children }: { children: ReactNode }) => {
  const llm = useLLM({
    modelSource: QWEN3_1_7B,
    tokenizerSource: QWEN3_TOKENIZER,
    tokenizerConfigSource: QWEN3_TOKENIZER_CONFIG,
  });

  const [configuredPokemon, setConfiguredPokemon] = useState<string | null>(
    null,
  );
  const configurePokemon = (pokemon: Pokemon) => {
    if (configuredPokemon === pokemon.name || !llm?.configure) return;
    llm.configure({
      chatConfig: {
        systemPrompt: `You are a Pokémon named ${pokemon.name}.
You are a ${pokemon.types.join(" and ")}-type Pokémon.
Your base stats are:
- HP: ${pokemon.stats[0].base_stat}
- Attack: ${pokemon.stats[2].base_stat}
- Defense: ${pokemon.stats[4].base_stat}
- Speed: ${pokemon.stats[1].base_stat}

Stay in character and speak like a Pokémon.
Don't use emojis.

If you need to use a tool calling, always include your Pokémon name (which is "${pokemon.name}") in the tool call arguments explicitly. Do not omit it.`,
      },
      toolsConfig: {
        tools: TOOL_DEFINITIONS,
        executeToolCallback: async (call) => {
          if (call.toolName === "get_pokemon_attacks") {
            console.log("Tool call: ", call);
            return "Solar Beam";
          }
          return null;
        },
        displayToolCalls: true,
      },
    });

    setConfiguredPokemon(pokemon.name);
  };

  const clearPokemonConfig = () => {
    setConfiguredPokemon(null);
  };

  return (
    <LLMContext.Provider
      value={{
        ...llm,
        configurePokemon,
        clearPokemonConfig,
      }}
    >
      {children}
    </LLMContext.Provider>
  );
};

export const useLLMInstance = () => useContext(LLMContext);
