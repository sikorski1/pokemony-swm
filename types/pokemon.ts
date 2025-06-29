export type PokemonResponse = {
  pageParam: number;
  pages: Pokemon[][];
};
export type StatKey =
  | "hp"
  | "speed"
  | "attack"
  | "special-attack"
  | "defense"
  | "special-defense";
export type PokemonStats = {
  base_stat: number;
  name: StatKey;
};
export type Pokemon = {
  id: number;
  name: string;
  image: string;
  types: string[];
  stats: PokemonStats[];
};

export type BottomSheetType = "chat" | "singlePokemon" | null;