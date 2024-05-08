import "./styles.css";

import { useSaperContext } from "../../App";
import { getHydratedFields } from "../../utils";
import { Timer } from "../Timer";

export const Controls = () => {
  const {
    setCountDown,
    setHydratedFields,
    bombsLeft,
    count,
    setCount,
    isExploded,
    isWon,
    isDraw,
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

  return (
    <div className="controls">
      <div className="controls-box">
        <Timer />
      </div>
      <button onClick={() => resetGame(count)} aria-label="reset game">
        {isWon ? "😎" : isDraw ? "😐" : isExploded ? "🥵" : "😀"}
      </button>
      <button className="controls-box" onClick={changeGameSize}>
        {bombsLeft}
      </button>
    </div>
  );
};
