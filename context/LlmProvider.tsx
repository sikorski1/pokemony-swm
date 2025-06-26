import { Pokemon } from "@/types/pokemon";
import { createContext, ReactNode, useContext, useState } from "react";
import {
  LLAMA3_2_1B,
  LLAMA3_2_TOKENIZER,
  LLAMA3_2_TOKENIZER_CONFIG,
  LLMTool,
  LLMType,
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
    modelSource: LLAMA3_2_1B,
    tokenizerSource: LLAMA3_2_TOKENIZER,
    tokenizerConfigSource: LLAMA3_2_TOKENIZER_CONFIG,
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
        `,
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
