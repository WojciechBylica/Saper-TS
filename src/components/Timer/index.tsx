import { useEffect, useRef } from "react";
import { Field } from "../../types";

type Props = {
  countDown: number;
  setCountDown: React.Dispatch<React.SetStateAction<number>>;
  isExploded: boolean;
  startTimer: boolean;
  isWon: boolean;
  hydratedFields: Field[];
  setHydratedFields: React.Dispatch<React.SetStateAction<Field[]>>;
};

export const Timer = ({
  countDown,
  setCountDown,
  isExploded,
  startTimer,
  isWon,
  hydratedFields,
  setHydratedFields,
}: Props) => {
  const intervalId = useRef<number | undefined>(undefined);

  const timeLeft = [
    { number: Math.floor((countDown / 1000 / 60) % 60), measure: "min" },
    { number: Math.floor((countDown / 1000) % 60), measure: "s" },
  ];

  useEffect(() => {
    intervalId.current = setInterval(() => {
      setCountDown((previousTime) => previousTime - 1000);
    }, 1000);

    return () => clearInterval(intervalId.current);
  }, [startTimer, setCountDown]);

  useEffect(() => {
    if (countDown <= 0 || isExploded || isWon) {
      clearInterval(intervalId.current);
      if (countDown <= 0) {
        const finalView: Field[] = hydratedFields.map((field) => ({
          ...field,
          state: "clicked",
        }));
        setHydratedFields(finalView);
      }
    }
  }, [countDown, isExploded, isWon]);

  return (
    <>
      {timeLeft.map((data, index) => (
        <span key={`time${index}`}>
          {data.number}
          {data.measure}
          {index === 0 && ":"}
        </span>
      ))}
    </>
  );
};
