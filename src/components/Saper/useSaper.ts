import { useSaperContext } from "../../App";
import { Field } from "../../types";
import {
  getCoordinatesOfSurroundingFields,
  getFieldID,
  getIsFieldClickable,
} from "../../utils";

export const useSaper = () => {
  const {
    count,
    hydratedFields,
    isWon,
    setHydratedFields,
    bombsLeft,
    setBombsLeft,
  } = useSaperContext();

  const onButtonClick = (
    id: number,
    hydratedFields: Field[],
    setHydratedFields: React.Dispatch<React.SetStateAction<Field[]>>,
  ) => {
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

  const handleClick = (
    id: number,
    hydratedFields: Field[],
    setHydratedFields: React.Dispatch<React.SetStateAction<Field[]>>,
  ) => {
    const field = hydratedFields.find((field) => field.id === id);

    if (
      id > hydratedFields.length ||
      id < 1 ||
      !field ||
      !getIsFieldClickable(field) ||
      field.bombsInTouch !== 0
    ) {
      return;
    }

    const coordinatesOfSurroundingFields =
      getCoordinatesOfSurroundingFields(field);

    coordinatesOfSurroundingFields.forEach(({ x, y }) => {
      const nextField = getFieldID(x, y, hydratedFields);

      if (nextField && getIsFieldClickable(nextField)) {
        onButtonClick(nextField.id, hydratedFields, setHydratedFields);
        // handleClick(nextField.id, hydratedFields,setHydratedFields);
      }
    });

    const nextFieldsToIterate = [
      coordinatesOfSurroundingFields[1],
      coordinatesOfSurroundingFields[3],
    ];

    nextFieldsToIterate.forEach(({ x, y }) => {
      const nextField = getFieldID(x, y, hydratedFields);
      if (nextField && getIsFieldClickable(nextField)) {
        handleClick(nextField.id, hydratedFields, setHydratedFields);
      }
    });
  };

  return {
    onButtonClick,
    handleClick,
    onRightButtonClick,
    count,
    isWon,
    hydratedFields,
    setHydratedFields,
  };
};
