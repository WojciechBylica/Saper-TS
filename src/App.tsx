import { useState } from "react";

import "./App.css";
import { getHydratedFields } from "./utils";
import type { Field } from "./types";
import { Timer } from "./assets/components";
import classNames from "classnames";

function App() {
  const [count, setCount] = useState<10 | 20>(10);
  const [bombsLeft, setBombsLeft] = useState<number>(count);
  const [hydratedFields, setHydratedFields] = useState(
    getHydratedFields(count),
  );

  const onButtonClick = (id: number) => {
    const editIndex = id - 1;
    const clickedField = hydratedFields[editIndex];
    if (clickedField.bomb) {
      const finalView: Field[] = hydratedFields.map((field) => ({
        ...field,
        state: field.id === id ? "exploded" : "clicked",
      }));
      setHydratedFields(finalView);
      return;
    }

    setHydratedFields((prevFields) => [
      ...prevFields.slice(0, editIndex),
      { ...prevFields[editIndex], state: "clicked" },
      ...prevFields.slice(editIndex + 1),
    ]);
  };

  const onRightButtonClick = (id: number) => {
    const editIndex = id - 1;

    if (bombsLeft === 0 && hydratedFields[editIndex].state !== "flagged")
      return;

    setHydratedFields((prevFields) => [
      ...prevFields.slice(0, editIndex),
      {
        ...prevFields[editIndex],
        state:
          hydratedFields[editIndex].state === "flagged" ? "virgin" : "flagged",
      },
      ...prevFields.slice(editIndex + 1),
    ]);

    setBombsLeft((prevState) =>
      hydratedFields[editIndex].state === "flagged"
        ? prevState + 1
        : prevState - 1,
    );
  };

  const handleClick = (id: number) => {
    const field = hydratedFields.find((field) => field.id === id);

    if (
      id > hydratedFields.length ||
      id < 1 ||
      !field ||
      (field &&
        (field.bomb || field?.state !== "virgin" || field.bombsInTouch !== 0))
    ) {
      return;
    }

    const nextIdField = hydratedFields.find(
      ({ x, y }) => x === field.x && y === field.y + 1,
    );

    if (nextIdField && !nextIdField.bomb && nextIdField.state === "virgin") {
      onButtonClick(nextIdField.id);
      handleClick(nextIdField.id);
    }

    //  onButtonClick(id)

    const prevIdField = hydratedFields.find(
      ({ x, y }) => x === field.x && y === field.y - 1,
    );

    if (prevIdField && !prevIdField.bomb && prevIdField.state === "virgin") {
      onButtonClick(prevIdField.id);
      // handleClick(prevIdField.id)
    }

    const aboveIdField = hydratedFields.find(
      ({ x, y }) => x === field.x - 1 && y === field.y,
    );

    if (aboveIdField && !aboveIdField.bomb && aboveIdField.state === "virgin") {
      onButtonClick(aboveIdField.id);
      handleClick(aboveIdField.id);
    }

    const underIdField = hydratedFields.find(
      ({ x, y }) => x === field.x + 1 && y === field.y,
    );

    if (underIdField && !underIdField.bomb && underIdField.state === "virgin") {
      onButtonClick(underIdField.id);
      // handleClick(underIdField.id)
    }

    if (field?.bombsInTouch !== 0 || field?.state !== "virgin") {
      return;
    }
    // handleClick(id+1)
  };

  const gameLength = 5 * 60_000; // 5min
  const [countDown, setCountDown] = useState(gameLength);

  const resetGame = () => {
    setHydratedFields(getHydratedFields(count));
    setBombsLeft(count);
    setCountDown(gameLength);
  };

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

  return (
    <div>
      <div className="controls">
        <div className="controls-box">
          <Timer
            {...{
              countDown,
              setCountDown,
              isExploded,
              startTimer,
              isWon,
              hydratedFields,
              setHydratedFields,
            }}
          />
        </div>
        <button onClick={resetGame} aria-label='reset game'>
          {isWon ? "😎" : isDraw ? "😐" : isExploded ? "🥵" : "😀"}
        </button>
        <div className="controls-box">{bombsLeft}</div>
      </div>
      <div className={`box${count === 20 ? " box-modified" : ""}`}>
        {hydratedFields.map((field) =>
          !isWon && (field.state === "virgin" || field.state === "flagged") ? (
            <button
              key={`field-${field.id}`}
              aria-label={`button with index x:${field.x}, y:${field.y} ${field.state === "flagged" ? "flagged" : "not flagged"}.`}
              onClick={() => {
                if (hydratedFields[field.id - 1].state === "flagged") return;
                onButtonClick(field.id);
                if (isWon) {
                  setHydratedFields;
                  return;
                }
                handleClick(field.id);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                onRightButtonClick(field.id);
              }}
            >
              {field.state === "flagged" ? "🚩" : ""}
            </button>
          ) : (
            <div
              key={`field-${field.id}`}
              className={classNames("box-field", {
                "box-field-exploded": field.state === "exploded",
                "box-field-safed": field.bomb && isWon,
              })}
            >
              {field.bomb
                ? "💣"
                : field.bombsInTouch === 0
                  ? ""
                  : field.bombsInTouch}
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default App;
