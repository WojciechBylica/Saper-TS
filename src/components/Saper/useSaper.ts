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
    initialFields,
    playAreaSize,
  } = useSaperContext();

  const onButtonClickAction = (
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

  const onRightButtonClickAction = (id: number) => {
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

  const handleClick = ( //rather 'iterateY()
    id: number,
    hydratedFields: Field[],
    setHydratedFields: React.Dispatch<React.SetStateAction<Field[]>>,
  ) => {
    const field = hydratedFields.find((field) => field.id === id);
    if(!field || field.bombsInTouch) return

    //**w lewo */
    let tempFieldBack: Field | undefined = field
    do {

      //**do góry-gdy w lewo */
      let fieldAboveGoingLeft: Field | undefined = tempFieldBack
      do {
        fieldAboveGoingLeft = getFieldID(fieldAboveGoingLeft.x-1, fieldAboveGoingLeft.y, hydratedFields)
        fieldAboveGoingLeft && onButtonClickAction(fieldAboveGoingLeft.id, hydratedFields, setHydratedFields)
      }
      while (
        fieldAboveGoingLeft && fieldAboveGoingLeft.x > 1 && !field.bomb && field.state === "virgin" && fieldAboveGoingLeft.bombsInTouch === 0 )

      //**w dół-gdy w lewo */
      let fieldUnderGoingRLeft: Field | undefined = tempFieldBack
      do {
        fieldUnderGoingRLeft = getFieldID(fieldUnderGoingRLeft.x+1, fieldUnderGoingRLeft.y, hydratedFields)
        fieldUnderGoingRLeft && onButtonClickAction(fieldUnderGoingRLeft.id, hydratedFields, setHydratedFields)
      }
      while (
        fieldUnderGoingRLeft && fieldUnderGoingRLeft.x < playAreaSize && !field.bomb && field.state === "virgin" && fieldUnderGoingRLeft.bombsInTouch === 0 )












      tempFieldBack = getFieldID(tempFieldBack.x, tempFieldBack.y-1, hydratedFields)
      tempFieldBack && onButtonClickAction(tempFieldBack.id, hydratedFields, setHydratedFields)
    }
    while (
      tempFieldBack && tempFieldBack.y > 1 && getIsFieldClickable(tempFieldBack) && tempFieldBack.bombsInTouch === 0 )


      //** w prawo */
    let tempFieldForward: Field | undefined = field
    do {

      //**do góry-gdy w prawo */
      let fieldAboveGoingRight: Field | undefined = tempFieldForward
      do {
        fieldAboveGoingRight = getFieldID(fieldAboveGoingRight!.x-1, fieldAboveGoingRight!.y, hydratedFields)
        fieldAboveGoingRight && onButtonClickAction(fieldAboveGoingRight.id, hydratedFields, setHydratedFields)
      }
      while (
        fieldAboveGoingRight && fieldAboveGoingRight.x > 1 && !field.bomb && field.state === "virgin" && fieldAboveGoingRight.bombsInTouch === 0 )

      //**w dół-gdy w prawo */
      let fieldUnderGoingRight: Field | undefined = tempFieldForward
      do {
        fieldUnderGoingRight = getFieldID(fieldUnderGoingRight!.x+1, fieldUnderGoingRight!.y, hydratedFields)
        fieldUnderGoingRight && onButtonClickAction(fieldUnderGoingRight.id, hydratedFields, setHydratedFields)
      }
      while (
        fieldUnderGoingRight && fieldUnderGoingRight.x < playAreaSize && !field.bomb && field.state === "virgin" && fieldUnderGoingRight.bombsInTouch === 0 )



      tempFieldForward = getFieldID(tempFieldForward.x, tempFieldForward.y+1, hydratedFields)
      tempFieldForward && onButtonClickAction(tempFieldForward.id, hydratedFields, setHydratedFields)
    }
    while ( tempFieldForward && tempFieldForward.y < playAreaSize && getIsFieldClickable(tempFieldForward) && tempFieldForward.bombsInTouch === 0 )





//***stary kod***
    // if (
    //   id > hydratedFields.length ||
    //   id < 1 ||
    //   !field ||
    //   !getIsFieldClickable(field) ||
    //   field.bombsInTouch !== 0
    // ) {
    //   return;
    // }

    // const coordinatesOfSurroundingFields =
    //   getCoordinatesOfSurroundingFields(field);

    // coordinatesOfSurroundingFields.forEach(({ x, y }) => {
    //   const nextField = getFieldID(x, y, hydratedFields);

    //   if (nextField && getIsFieldClickable(nextField)) {
    //     onButtonClickAction(nextField.id, hydratedFields, setHydratedFields);
    //     // handleClick(nextField.id, hydratedFields,setHydratedFields);
    //   }
    // });

    // const nextFieldsToIterate = [
    //   coordinatesOfSurroundingFields[1],
    //   coordinatesOfSurroundingFields[3],
    // ];

    // nextFieldsToIterate.forEach(({ x, y }) => {
    //   const nextField = getFieldID(x, y, hydratedFields);
    //   if (nextField && getIsFieldClickable(nextField)) {
    //     // handleClick(nextField.id, hydratedFields, setHydratedFields);
    //     // handleClick(nextField.id);
    //   }
    // });
  };

  return {
    onButtonClickAction,
    handleClick,
    onRightButtonClickAction,
    count,
    isWon,
    hydratedFields,
    setHydratedFields,
    initialFields,
    playAreaSize,
  };
};
