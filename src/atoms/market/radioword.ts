import { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

const defaultValue = "volume";

const localStorage =
  typeof window !== "undefined" ? window.localStorage : undefined;

const { persistAtom } = recoilPersist({
  key: "market-persist-radio",
  storage: localStorage,
});
const marketRadioState = atom<"volume" | "change">({
  key: "marketRadioAtom",
  default: defaultValue,
  effects_UNSTABLE: [persistAtom],
});

function useMarketRadioState() {
  const [isInitial, setIsInitial] = useState(true);
  const [value, setValue] = useRecoilState(marketRadioState);

  useEffect(() => {
    setIsInitial(false);
  }, []);

  return [isInitial ? defaultValue : value, setValue] as const;
}

export { marketRadioState, useMarketRadioState };
