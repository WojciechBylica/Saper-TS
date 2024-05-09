import "./styles.css";

import { useSaperContext } from "../../App";
import { Timer } from "../Timer";
import { useControls } from "./useControls";

export const Controls = () => {
  const { bombsLeft, count, isExploded, isWon, isDraw } = useSaperContext();

  const { resetGame, changeGameSize } = useControls();

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
