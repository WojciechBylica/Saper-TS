import { Field } from "./types";

export const getRandomIntFromInterval = (max: number) =>
  Math.floor(Math.random() * max + 1);

export const getBombIndexes = (count: number) => {
  const bombIndexes: number[] = [];

  do {
    bombIndexes.push(getRandomIntFromInterval(count * count));
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

export const getFlags = (fields: Field[]) => {
  const flags: number[] = [];

  fields.forEach((field) => {
    let bombsInTouch = 0;

    !field.bomb &&
      fields.find(({ x, id }) => x === field.x && id === field.id - 1)?.bomb &&
      bombsInTouch++;
    !field.bomb &&
      fields.find(({ x, id }) => x === field.x && id === field.id + 1)?.bomb &&
      bombsInTouch++;

    !field.bomb &&
      fields.find(({ x, y }) => x === field.x - 1 && y === field.y - 1)?.bomb &&
      bombsInTouch++;
    !field.bomb &&
      fields.find(({ x, y }) => x === field.x - 1 && y === field.y)?.bomb &&
      bombsInTouch++;
    !field.bomb &&
      fields.find(({ x, y }) => x === field.x - 1 && y === field.y + 1)?.bomb &&
      bombsInTouch++;

    !field.bomb &&
      fields.find(({ x, y }) => x === field.x + 1 && y === field.y - 1)?.bomb &&
      bombsInTouch++;
    !field.bomb &&
      fields.find(({ x, y }) => x === field.x + 1 && y === field.y)?.bomb &&
      bombsInTouch++;
    !field.bomb &&
      fields.find(({ x, y }) => x === field.x + 1 && y === field.y + 1)?.bomb &&
      bombsInTouch++;

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
