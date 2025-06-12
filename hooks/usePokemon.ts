import { Markers } from "@/types/map";
import { Pokemon, PokemonStats, StatKey } from "@/types/pokemon";
import { useInfiniteQuery, useQueries, useQuery } from "@tanstack/react-query";
import axios from "axios";
const PAGE_SIZE = 30;
const statOrder: StatKey[] = [
  "hp",
  "speed",
  "attack",
  "special-attack",
  "defense",
  "special-defense",
];
const statIndexMap = new Map<StatKey, number>(
  statOrder.map((key, index) => [key, index]),
);
const fetchPokemons = async ({ pageParam = 0 }: { pageParam: number }) => {
  try {
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_POKEMON_API}/pokemon?offset=${pageParam}&limit=${PAGE_SIZE}`,
    );
    const results = response.data.results;
    const count = response.data.count;
    const detailedResponse = await Promise.all(
      results.map(async (p: any) => {
        const response = await axios.get(p.url);
        const name = response.data.forms[0].name;
        const image = response.data.sprites.front_shiny;
        const types = response.data.types.map((type: any) => type.type.name);
        const stats = response.data.stats
          .map((singleStat: any) => {
            const { base_stat, stat } = singleStat;
            return { base_stat, name: stat.name };
          })
          .sort((a: PokemonStats, b: PokemonStats) => {
            return (
              (statIndexMap.get(a.name as StatKey) ?? Infinity) -
              (statIndexMap.get(b.name as StatKey) ?? Infinity)
            );
          });
        return {
          name,
          image,
          types,
          stats,
          id: response.data.id,
        };
      }),
    );
    return { detailedResponse, count };
  } catch (error) {
    console.error("Error fetching pokemons:", error);
    throw new Error("Failed to fetch pokemons");
  }
};
const fetchFavouritePokemon = async (pokemonName: string) => {
  try {
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_POKEMON_API}/pokemon/${pokemonName}`,
    );
    const name = response.data.forms[0].name;
    const image = response.data.sprites.front_shiny;
    const types = response.data.types.map((type: any) => type.type.name);
    const stats = response.data.stats
      .map((singleStat: any) => {
        const { base_stat, stat } = singleStat;
        return { base_stat, name: stat.name };
      })
      .sort((a: PokemonStats, b: PokemonStats) => {
        return (
          (statIndexMap.get(a.name as StatKey) ?? Infinity) -
          (statIndexMap.get(b.name as StatKey) ?? Infinity)
        );
      });
    return {
      name,
      image,
      types,
      stats,
      id: response.data.id,
    };
  } catch (error) {
    console.error("Error fetching favourite pokemon:", error);
    throw new Error("Failed to favourite pokemon");
  }
};
export const useGetPokemons = () => {
  return useInfiniteQuery<
    Pokemon[],
    Error,
    { pageParams: any; pages: { count: number; detailedResponse: Pokemon[] }[] }
  >({
    queryKey: ["pokemons"],
    queryFn: fetchPokemons,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 0 ? undefined : allPages.length * PAGE_SIZE,
  });
};

export const useGetFavouritePokemon = (pokemonName?: string) => {
  return useQuery<Pokemon, Error>({
    queryKey: ["favouritePokemon", pokemonName],
    queryFn: () => fetchFavouritePokemon(pokemonName!),
    enabled: !!pokemonName,
  });
};

export const useGetPokemonMarkers = (markers: Markers[]) => {
  return useQueries({
    queries: markers.map((markers) => ({
      queryKey: ["markers", markers.name.toLowerCase()],
      queryFn: () => fetchFavouritePokemon(markers.name.toLowerCase()),
      enabled: !!markers.name,
    })),
  });
};
