import { useSaperContext } from "../../App";
import { getHydratedFields } from "../../utils";

export const useControls = () => {
  const {
    setCountDown,
    setHydratedFields,
    count,
    setCount,
    gameLength,
    setBombsLeft,
  } = useSaperContext();

  const resetGame = (count: number) => {
    setHydratedFields(getHydratedFields(count));
    setBombsLeft(count);
    setCountDown(gameLength);
  };

  const changeGameSize = () => {
    const newCount = count === 20 ? 10 : 20;
    setCount(newCount);
    resetGame(newCount);
  };

  return { resetGame, changeGameSize };
};
