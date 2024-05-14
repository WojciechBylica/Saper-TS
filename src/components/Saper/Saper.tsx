import "./styles.css";
import classNames from "classnames";

import { useSaper } from "./useSaper";

export const Saper = () => {
  const {
    onButtonClick,
    handleClick,
    onRightButtonClick,
    count,
    isWon,
    hydratedFields,
    setHydratedFields,
  } = useSaper();

  return (
    <div className={classNames("box", { "box-modified": count === 20 })}>
      {hydratedFields.map(({ state, id, x, y, bomb, bombsInTouch }) =>
        !isWon && (state === "virgin" || state === "flagged") ? (
          <button
            key={`field-${id}`}
            aria-label={`button with index x:${x}, y:${y} ${state === "flagged" ? "flagged" : "not flagged"}.`}
            onClick={() => {
              if (hydratedFields[id - 1].state === "flagged") return;
              onButtonClick(id, hydratedFields, setHydratedFields);
              if (isWon) {
                setHydratedFields;
                return;
              }
              handleClick(id, hydratedFields, setHydratedFields);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              onRightButtonClick(id);
            }}
          >
            {state === "flagged" ? "🚩" : ""}
          </button>
        ) : (
          <div
            key={`field-${id}`}
            className={classNames("box-field", {
              "box-field-exploded": state === "exploded",
              "box-field-saved": bomb && isWon,
            })}
          >
            {bomb ? "💣" : bombsInTouch === 0 ? "" : bombsInTouch}
          </div>
        ),
      )}
    </div>
  );
};
