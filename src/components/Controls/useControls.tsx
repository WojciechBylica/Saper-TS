import { useSaperContext } from "../../App";
import { Count, PlayAreaSize } from "../../types";
import { getInitialFields } from "../../utils";

export const useControls = () => {
  const {
    setCountDown,
    setHydratedFields,
    setCount,
    gameLength,
    setBombsLeft,
  } = useSaperContext();

  const resetGame = (count: number, playAreaSize: PlayAreaSize) => {
    setHydratedFields(getInitialFields(playAreaSize));
    setBombsLeft(count);
    setCountDown(gameLength);
  };

  const getNewCount = (prevCount: Count): Count => {
    switch (prevCount) {
      case 10:
        return 40;
      case 40:
        return 60;
      case 60:
        return 80;
      case 80:
        return 10;
      default:
        return 10;
    }
  };

  const changeGameSize = (count: Count) => {
    const newCount = getNewCount(count);
    const newPlayAreaSize: PlayAreaSize = newCount === 10 ? 10 : 15;
    setCount(newCount);
    resetGame(newCount, newPlayAreaSize);
  };

  return { resetGame, changeGameSize };
};
