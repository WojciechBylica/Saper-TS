import {
  Field,
  OnButtonClickAction,
  PlayAreaSize,
  SetHydratedFields,
} from "../../types";
import {
  getCoordinatesOfSurroundingFields,
  getFieldID,
  getIsFieldClickable,
} from "../../utils";

const clickAboveAndUnderButton = (
  tempField: Field | undefined,
  onButtonClickAction: OnButtonClickAction,
  hydratedFields: Field[],
  setHydratedFields: SetHydratedFields,
) => {
  if (tempField && tempField.bombsInTouch > 0) {
    const coordinatesOfSurroundingFields =
      getCoordinatesOfSurroundingFields(tempField);
    const coordinatesToClick = [
      coordinatesOfSurroundingFields[3],
      coordinatesOfSurroundingFields[6],
    ];
    coordinatesToClick.forEach(({ x, y }) => {
      const nextField = getFieldID(x, y, hydratedFields);

      if (nextField && getIsFieldClickable(nextField)) {
        onButtonClickAction(nextField.id, hydratedFields, setHydratedFields);
      }
    });
  }
};

export const loopFunction = (
  prevField: Field,
  dir: "left" | "right" | "up" | "down",
  playAreaSize: PlayAreaSize,
  hydratedFields: Field[],
  setHydratedFields: SetHydratedFields,
  onButtonClickAction: OnButtonClickAction,
) => {
  let tempField: Field | undefined = prevField;
  const getTempFieldCondition = (
    dir: "left" | "right" | "up" | "down",
    tempField: Field,
  ) => {
    switch (dir) {
      case "left":
        return tempField.y >= 1;
      case "right":
        return tempField.y <= playAreaSize;
      default:
        true;
    }
  };
  do {
    tempField = getFieldID(
      dir === "up"
        ? tempField.x - 1
        : dir === "down"
          ? tempField.x + 1
          : tempField.x,
      dir === "left"
        ? tempField.y - 1
        : dir === "right"
          ? tempField.y + 1
          : tempField.y,
      hydratedFields,
    );
    tempField &&
      onButtonClickAction(tempField.id, hydratedFields, setHydratedFields);
    clickAboveAndUnderButton(
      tempField,
      onButtonClickAction,
      hydratedFields,
      setHydratedFields,
    );
  } while (
    tempField &&
    getTempFieldCondition(dir, tempField) &&
    getIsFieldClickable(tempField) &&
    tempField.bombsInTouch === 0
  );
};

export const iterateEmptyFields = (
  id: number,
  hydratedFields: Field[],
  setHydratedFields: SetHydratedFields,
  onButtonClickAction: OnButtonClickAction,
  playAreaSize: PlayAreaSize,
) => {
  const field = hydratedFields.find((field) => field.id === id);
  if (!field || field.bombsInTouch) return;

  //**w lewo */
  let tempFieldBack: Field | undefined = field;
  do {
    //**do góry-gdy w lewo */
    let fieldAboveGoingLeft: Field | undefined = tempFieldBack;
    do {
      //**w lewo */
      loopFunction(
        fieldAboveGoingLeft,
        "left",
        playAreaSize,
        hydratedFields,
        setHydratedFields,
        onButtonClickAction,
      );
      //** w prawo */
      loopFunction(
        fieldAboveGoingLeft,
        "right",
        playAreaSize,
        hydratedFields,
        setHydratedFields,
        onButtonClickAction,
      );

      fieldAboveGoingLeft = getFieldID(
        fieldAboveGoingLeft.x - 1,
        fieldAboveGoingLeft.y,
        hydratedFields,
      );
      fieldAboveGoingLeft &&
        onButtonClickAction(
          fieldAboveGoingLeft.id,
          hydratedFields,
          setHydratedFields,
        );
    } while (
      fieldAboveGoingLeft &&
      fieldAboveGoingLeft.x > 1 &&
      !field.bomb &&
      field.state === "virgin" &&
      fieldAboveGoingLeft.bombsInTouch === 0
    );

    //**w dół-gdy w lewo */
    let fieldUnderGoingRLeft: Field | undefined = tempFieldBack;
    do {
      //**w lewo */
      loopFunction(
        fieldUnderGoingRLeft,
        "left",
        playAreaSize,
        hydratedFields,
        setHydratedFields,
        onButtonClickAction,
      );
      //** w prawo */
      loopFunction(
        fieldUnderGoingRLeft,
        "right",
        playAreaSize,
        hydratedFields,
        setHydratedFields,
        onButtonClickAction,
      );

      fieldUnderGoingRLeft = getFieldID(
        fieldUnderGoingRLeft.x + 1,
        fieldUnderGoingRLeft.y,
        hydratedFields,
      );
      fieldUnderGoingRLeft &&
        onButtonClickAction(
          fieldUnderGoingRLeft.id,
          hydratedFields,
          setHydratedFields,
        );
    } while (
      fieldUnderGoingRLeft &&
      fieldUnderGoingRLeft.x <= playAreaSize &&
      !field.bomb &&
      field.state === "virgin" &&
      fieldUnderGoingRLeft.bombsInTouch === 0
    );

    tempFieldBack = getFieldID(
      tempFieldBack.x,
      tempFieldBack.y - 1,
      hydratedFields,
    );
    tempFieldBack &&
      onButtonClickAction(tempFieldBack.id, hydratedFields, setHydratedFields);
    clickAboveAndUnderButton(
      tempFieldBack,
      onButtonClickAction,
      hydratedFields,
      setHydratedFields,
    );
  } while (
    tempFieldBack &&
    tempFieldBack.y >= 1 &&
    getIsFieldClickable(tempFieldBack) &&
    tempFieldBack.bombsInTouch === 0
  );

  //** w prawo */
  let tempFieldForward: Field | undefined = field;
  do {
    //**do góry-gdy w prawo */
    let fieldAboveGoingRight: Field | undefined = tempFieldForward;
    do {
      //**w lewo */
      loopFunction(
        fieldAboveGoingRight,
        "left",
        playAreaSize,
        hydratedFields,
        setHydratedFields,
        onButtonClickAction,
      );
      //** w prawo */
      loopFunction(
        fieldAboveGoingRight,
        "right",
        playAreaSize,
        hydratedFields,
        setHydratedFields,
        onButtonClickAction,
      );

      fieldAboveGoingRight = getFieldID(
        fieldAboveGoingRight!.x - 1,
        fieldAboveGoingRight!.y,
        hydratedFields,
      );
      fieldAboveGoingRight &&
        onButtonClickAction(
          fieldAboveGoingRight.id,
          hydratedFields,
          setHydratedFields,
        );
    } while (
      fieldAboveGoingRight &&
      fieldAboveGoingRight.x > 1 &&
      !field.bomb &&
      field.state === "virgin" &&
      fieldAboveGoingRight.bombsInTouch === 0
    );

    //**w dół-gdy w prawo */
    let fieldUnderGoingRight: Field | undefined = tempFieldForward;
    do {
      //**w lewo */
      loopFunction(
        fieldUnderGoingRight,
        "left",
        playAreaSize,
        hydratedFields,
        setHydratedFields,
        onButtonClickAction,
      );
      //** w prawo */
      loopFunction(
        fieldUnderGoingRight,
        "right",
        playAreaSize,
        hydratedFields,
        setHydratedFields,
        onButtonClickAction,
      );

      fieldUnderGoingRight = getFieldID(
        fieldUnderGoingRight!.x + 1,
        fieldUnderGoingRight!.y,
        hydratedFields,
      );
      fieldUnderGoingRight &&
        onButtonClickAction(
          fieldUnderGoingRight.id,
          hydratedFields,
          setHydratedFields,
        );
    } while (
      fieldUnderGoingRight &&
      fieldUnderGoingRight.x <= playAreaSize &&
      !field.bomb &&
      field.state === "virgin" &&
      fieldUnderGoingRight.bombsInTouch === 0
    );

    tempFieldForward = getFieldID(
      tempFieldForward.x,
      tempFieldForward.y + 1,
      hydratedFields,
    );
    tempFieldForward &&
      onButtonClickAction(
        tempFieldForward.id,
        hydratedFields,
        setHydratedFields,
      );
    clickAboveAndUnderButton(
      tempFieldForward,
      onButtonClickAction,
      hydratedFields,
      setHydratedFields,
    );
  } while (
    tempFieldForward &&
    tempFieldForward.y <= playAreaSize &&
    getIsFieldClickable(tempFieldForward) &&
    tempFieldForward.bombsInTouch === 0
  );
};
