import { atom, useRecoilState } from "recoil";

const defaultValue: OrderInputState = {
  sell: {
    price: "",
    amount: "",
  },
  buy: {
    price: "",
    amount: "",
  },
};

const orderInputAtom = atom<OrderInputState>({
  key: "orderInputAtom",
  default: defaultValue,
});

function useOrderInputAtom() {
  const [data, setData] = useRecoilState(orderInputAtom);

  const updateData = (
    type: "sell" | "buy",
    key: keyof OrderInput,
    value: string
  ) => {
    setData((prevState) => ({
      ...prevState,
      [type]: {
        ...prevState[type],
        [key]: value,
      },
    }));
  };

  return { data, setData, updateData };
}

export { orderInputAtom, useOrderInputAtom };
