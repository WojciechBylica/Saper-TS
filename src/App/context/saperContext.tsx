import { ReactNode, createContext, useState } from "react";

import { Count, Field, PlayAreaSize, SetHydratedFields } from "../../types";
import { getInitialFields } from "../../utils";

interface SaperContextType {
  count: Count;
  setCount: React.Dispatch<React.SetStateAction<Count>>;
  bombsLeft: number;
  setBombsLeft: React.Dispatch<React.SetStateAction<number>>;
  initialFields: Field[];
  playAreaSize: PlayAreaSize;
  hydratedFields: Field[];
  setHydratedFields: SetHydratedFields;
  gameLength: number;
  countDown: number;
  setCountDown: React.Dispatch<React.SetStateAction<number>>;
  isExploded: boolean;
  startTimer: boolean;
  isDraw: boolean;
  isWon: boolean;
}

export const SaperContext = createContext<SaperContextType | null>(null);

const useSaper = () => {
  const [count, setCount] = useState<Count>(10);
  const playAreaSize: PlayAreaSize = count === 10 ? 10 : 15;
  const [bombsLeft, setBombsLeft] = useState<number>(count);
  const initialFields: Field[] = getInitialFields(playAreaSize);
  const [hydratedFields, setHydratedFields] = useState(initialFields);
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
    initialFields,
    playAreaSize,
  };
};

export const SaperContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SaperContext.Provider value={useSaper()}>{children}</SaperContext.Provider>
  );
};
