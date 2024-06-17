import { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

const defaultValue: string[] = [];

const localStorage =
  typeof window !== "undefined" ? window.localStorage : undefined;

const { persistAtom } = recoilPersist({
  key: "market-persist-favorites",
  storage: localStorage,
});
const favoritesState = atom<string[]>({
  key: "marketFavoritesAtom",
  default: defaultValue,
  effects_UNSTABLE: [persistAtom],
});

function useFavoritesState() {
  const [isInitial, setIsInitial] = useState(true);
  const [value, setValue] = useRecoilState(favoritesState);

  useEffect(() => {
    setIsInitial(false);
  }, []);

  return [isInitial ? defaultValue : value, setValue] as const;
}

export { favoritesState, useFavoritesState };
