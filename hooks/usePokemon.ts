import { Pokemon } from "@/types/pokemon";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
const PAGE_SIZE = 30;
const fetchPokemons = async ({ pageParam = 0 }: { pageParam: number }) => {
  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?offset=${pageParam}&limit=${PAGE_SIZE}`,
    );
    const results = response.data.results;
    const count = response.data.count;
    const detailedResponse = await Promise.all(
      results.map(async (p: any) => {
        const singleResponse = await axios.get(p.url);
        const name = singleResponse.data.forms[0].name;
        const image = singleResponse.data.sprites.front_default;
        const types = singleResponse.data.types.map(
          (type: any) => type.type.name,
        );
        return {
          name,
          image,
          types,
        };
      }),
    );
    return { detailedResponse, count };
  } catch (error) {
    console.error("Error fetching pokemons:", error);
    throw new Error("Failed to fetch pokemons");
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
