import "./styles.css";
import classNames from "classnames";

import { useSaper } from "./useSaper";
import { getHydratedFields } from "../../utils";

export const Saper = () => {
  const {
    onButtonClickAction,
    handleClick,
    onRightButtonClickAction,
    count,
    isWon,
    hydratedFields,
    setHydratedFields,
    initialFields,
    playAreaSize,
  } = useSaper();

  return (
    <div className={classNames("box", { "box-modified": count !== 10 })}>
      {hydratedFields.map(({ state, id, x, y, bomb, bombsInTouch }) =>
        !isWon && (state === "virgin" || state === "flagged") ? (
          <button
            key={`field-${id}`}
            aria-label={`button with index x:${x}, y:${y} ${state === "flagged" ? "flagged" : "not flagged"}.`}
            onClick={() => {
              if (hydratedFields[id - 1].state === "flagged") return;

              if (!hydratedFields.some((field) => field.state === "clicked")) {
                //** handleFirstClick() *
                const fieldsAfterFirstClick = getHydratedFields(
                  playAreaSize,
                  count,
                  initialFields,
                  id,
                );
                setHydratedFields(fieldsAfterFirstClick);
                onButtonClickAction(
                  id,
                  fieldsAfterFirstClick,
                  setHydratedFields,
                );
                handleClick(id, fieldsAfterFirstClick, setHydratedFields);
                return;
              }
              //**handleNotFirstClick() */
              onButtonClickAction(id, hydratedFields, setHydratedFields);
              if (isWon) return;
              handleClick(id, hydratedFields, setHydratedFields);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              onRightButtonClickAction(id);
            }}
          >
            {state === "flagged" ? "🚩" : ""}
            {/* {bomb && 'b'}  */}
          </button> // temporary 
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
