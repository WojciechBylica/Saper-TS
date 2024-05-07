import { ReactNode, createContext, useContext, useState } from "react";

import { Field } from "../types";
import { getHydratedFields } from "../utils";

interface SaperContextType {
  count: 10 | 20;
  setCount: React.Dispatch<React.SetStateAction<10 | 20>>;
  bombsLeft: number;
  setBombsLeft: React.Dispatch<React.SetStateAction<number>>;
  hydratedFields: Field[];
  setHydratedFields: React.Dispatch<React.SetStateAction<Field[]>>;
  gameLength: number;
  countDown: number;
  setCountDown: React.Dispatch<React.SetStateAction<number>>;
  isExploded: boolean;
  startTimer: boolean;
  isDraw: boolean;
  isWon: boolean;
}

export const SaperContext = createContext<SaperContextType | null>(null);

export const useSaperContext = () => {
  const context = useContext(SaperContext);
  if (context) {
    return context;
  }
  throw new Error(
    "Oh no! Component should be placed inside SaperContextProvider",
  );
};

const useSaper = () => {
  const [count, setCount] = useState<10 | 20>(10);
  const [bombsLeft, setBombsLeft] = useState<number>(count);
  const [hydratedFields, setHydratedFields] = useState(
    getHydratedFields(count),
  );
  const gameLength = 5 * 60_000; // 5min
  const [countDown, setCountDown] = useState(gameLength);

  const isExploded = hydratedFields.some((field) => field.state === "exploded");
  const startTimer = countDown === gameLength;
  const isDraw = countDown === 0 && !isExploded;
  const isWon =
    countDown > 0 &&
    hydratedFields
      .filter((field) => !field.bomb)
      .every((field) => field.state === "clicked") &&
    hydratedFields
      .filter((field) => field.bomb)
      .every(({ state }) => state !== "exploded");

  return {
    count,
    setCount,
    bombsLeft,
    setBombsLeft,
    hydratedFields,
    setHydratedFields,
    gameLength,
    countDown,
    setCountDown,
    isExploded,
    startTimer,
    isDraw,
    isWon,
  };
};

export const SaperContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SaperContext.Provider value={useSaper()}>{children}</SaperContext.Provider>
  );
};
