import { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

const defaultValue = "usdt";

const localStorage =
  typeof window !== "undefined" ? window.localStorage : undefined;

const { persistAtom } = recoilPersist({
  key: "market-persist-tab",
  storage: localStorage,
});
const marketTabAtom = atom<string>({
  key: "marketTabAtom",
  default: defaultValue,
  effects_UNSTABLE: [persistAtom],
});

function useMarketTabState() {
  const [isInitial, setIsInitial] = useState(true);
  const [value, setValue] = useRecoilState(marketTabAtom);

  useEffect(() => {
    setIsInitial(false);
  }, []);

  return [isInitial ? defaultValue : value, setValue] as const;
}

export { marketTabAtom, useMarketTabState };
