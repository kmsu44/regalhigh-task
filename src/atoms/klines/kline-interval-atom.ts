import { Interval } from "@binance/connector-typescript";
import { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

const defaultValue = Interval["1d"];

const localStorage =
  typeof window !== "undefined" ? window.localStorage : undefined;

const { persistAtom } = recoilPersist({
  key: "kline-persist",
  storage: localStorage,
});
const klineInterval = atom<Interval>({
  key: "kline-interval-atom",
  default: defaultValue,
  effects_UNSTABLE: [persistAtom],
});

function useKlineIntervalState() {
  const [isInitial, setIsInitial] = useState(true);
  const [value, setValue] = useRecoilState(klineInterval);

  useEffect(() => {
    setIsInitial(false);
  }, []);

  return [isInitial ? defaultValue : value, setValue] as const;
}

export { klineInterval, useKlineIntervalState };
