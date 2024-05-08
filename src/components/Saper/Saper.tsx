import './styles.css'
import classNames from "classnames";

import { useSaperContext } from "../../App";
import type { Field } from "../../types";
import { getFieldID, getIsFieldClickable } from '../../utils';

export const Saper = () => {
  const {
    count,
    hydratedFields,
    isWon,
    setHydratedFields,
    bombsLeft,
    setBombsLeft,
  } = useSaperContext();

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

    const nextIdField = getFieldID(field.x, field.y + 1, hydratedFields)

    if (nextIdField && getIsFieldClickable(nextIdField)) {
      onButtonClick(nextIdField.id);
      handleClick(nextIdField.id);
    }

    const prevIdField = getFieldID(field.x, field.y -1, hydratedFields)

    if (prevIdField && getIsFieldClickable(prevIdField)) {
      onButtonClick(prevIdField.id);
    }

    const aboveIdField = getFieldID(field.x -1, field.y, hydratedFields)

    if (aboveIdField && getIsFieldClickable(aboveIdField)) {
      onButtonClick(aboveIdField.id);
      handleClick(aboveIdField.id);
    }

    const underIdField = getFieldID(field.x +1, field.y, hydratedFields)

    if (underIdField && getIsFieldClickable(underIdField)) {
      onButtonClick(underIdField.id);
    }
  };

  return (
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
              "box-field-saved": field.bomb && isWon,
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
  );
};
