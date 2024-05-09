import { Field } from "./types";

export const getRandomIntFromInterval = (max: number) =>
  Math.floor(Math.random() * max + 1);

export const getBombIndexes = (count: number) => {
  const bombIndexes: number[] = [];

  do {
    const bombIndex = getRandomIntFromInterval(count * count)
    !bombIndexes.includes(bombIndex) && bombIndexes.push(getRandomIntFromInterval(count * count));
  } while (bombIndexes.length < count);

  return bombIndexes;
};

export const getInitialFields = (count: number) => {
  const bombIndexes = getBombIndexes(count);
  const fields: Field[] = [];
  const numberOfFields = count * count;
  let x = 1;
  let y = 1;

  for (let id = 1; id <= numberOfFields; id++) {
    fields.push({
      id,
      x,
      y,
      state: "virgin",
      bomb: bombIndexes.includes(id),
      bombsInTouch: 0,
    });

    if (y === count) {
      x++;
      y = 1;
    } else {
      y++;
    }
  }

  return fields;
};

export const getIsFieldClickable = (field: Field) =>
  !field.bomb && field.state === "virgin";
export const getFieldID = (
  fieldX: number,
  fieldY: number,
  hydratedFields: Field[],
) => hydratedFields.find(({ x, y }) => x === fieldX && y === fieldY);

export const getCoordinatesOfSurroundingFields = (field: Field) => {
  return [
    { x: field.x, y: field.y - 1 },
    { x: field.x, y: field.y + 1 },
    { x: field.x - 1, y: field.y - 1 },
    { x: field.x - 1, y: field.y },
    { x: field.x - 1, y: field.y + 1 },
    { x: field.x + 1, y: field.y - 1 },
    { x: field.x + 1, y: field.y },
    { x: field.x + 1, y: field.y + 1 },
  ]
}

export const getFlags = (fields: Field[]) => {
  const flags: number[] = [];
  const getIsFieldInBombTouch = (
    fieldX: number,
    fieldY: number,
    fields: Field[],
  ) => fields.find(({ x, y }) => x === fieldX && y === fieldY)?.bomb;

  fields.forEach((field) => {
    let bombsInTouch = 0;

    const coordinatesOfSurroundingFields = getCoordinatesOfSurroundingFields(field)

    coordinatesOfSurroundingFields.forEach(
      ({ x, y }) => getIsFieldInBombTouch(x, y, fields) && bombsInTouch++,
    );

    flags.push(bombsInTouch);
  });
  return flags;
};

export const getHydratedFields = (count: number) => {
  const fields = getInitialFields(count);
  const flags = getFlags(fields);
  const hydratedFields: Field[] = [];

  fields.forEach(({ id, x, y, state, bomb }) =>
    hydratedFields.push({ id, x, y, state, bomb, bombsInTouch: flags[id - 1] }),
  );

  return hydratedFields;
};


