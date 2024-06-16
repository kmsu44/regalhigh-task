import { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

const defaultValue: SortValue = {
  sortValue: "pair",
  sortDirection: "desc",
};
const localStorage =
  typeof window !== "undefined" ? window.localStorage : undefined;

const { persistAtom } = recoilPersist({
  key: "market-persist-sortValue",
  storage: localStorage,
});
const marketSortAtom = atom<SortValue>({
  key: "marketSortAtom",
  default: defaultValue,
  effects_UNSTABLE: [persistAtom],
});

function useMarketSortState() {
  const [isInitial, setIsInitial] = useState(true);
  const [value, setValue] = useRecoilState(marketSortAtom);

  useEffect(() => {
    setIsInitial(false);
  }, []);

  return [isInitial ? defaultValue : value, setValue] as const;
}

export { marketSortAtom, useMarketSortState };
