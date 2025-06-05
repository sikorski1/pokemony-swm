export type PokemonResponse = {
  pageParam: number;
  pages: Pokemon[][];
};
export type Pokemon = {
  name: string;
  image: string;
  types: string[];
};
