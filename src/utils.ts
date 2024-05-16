import { Field, PlayAreaSize } from './types'

export const getRandomIntFromInterval = (max: number) => Math.floor(Math.random() * max + 1)

export const getBombIndexes = (playAreaSize: PlayAreaSize, count: number, clickedFieldID: number) => {
  const bombIndexes: number[] = []
  do {
    const bombIndex = getRandomIntFromInterval(playAreaSize * playAreaSize)
    !bombIndexes.includes(bombIndex) && bombIndex !== clickedFieldID && bombIndexes.push(bombIndex)
  } while (bombIndexes.length < count)

  return bombIndexes
}

export const getInitialFields = (playAreaSize: PlayAreaSize) => {
  const fields: Field[] = []
  const numberOfFields = playAreaSize * playAreaSize
  let x = 1
  let y = 1

  for (let id = 1; id <= numberOfFields; id++) {
    fields.push({
      id,
      x,
      y,
      state: 'virgin',
      bomb: false,
      bombsInTouch: 0,
    })

    if (y === playAreaSize) {
      x++
      y = 1
    } else {
      y++
    }
  }

  return fields
}

export const getIsFieldClickable = (field: Field) => !field.bomb && field.state === 'virgin'

export const getFieldID = (fieldX: number, fieldY: number, hydratedFields: Field[]) =>
  hydratedFields.find(({ x, y }) => x === fieldX && y === fieldY)

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
const getIsFieldInBombTouch = (fieldX: number, fieldY: number, fields: Field[]) =>
  fields.find(({ x, y }) => x === fieldX && y === fieldY)?.bomb

export const getFlags = (fields: Field[]) => {
  const flags: number[] = []

  fields.forEach((field) => {
    let bombsInTouch = 0

    const coordinatesOfSurroundingFields = getCoordinatesOfSurroundingFields(field)

    coordinatesOfSurroundingFields.forEach(({ x, y }) => getIsFieldInBombTouch(x, y, fields) && bombsInTouch++)

    flags.push(bombsInTouch)
  })
  return flags
}

export const getHydratedFields = (
  playAreaSize: PlayAreaSize,
  count: number,
  initialFields: Field[],
  clickedFieldID: number
) => {
  const initialFieldsWithBombs: Field[] = []
  const bombIndexes = getBombIndexes(playAreaSize, count, clickedFieldID)
  initialFields.forEach(({ id, x, y, state, bombsInTouch }) =>
    initialFieldsWithBombs.push({
      id,
      x,
      y,
      state,
      bomb: bombIndexes.includes(id),
      bombsInTouch,
    })
  )

  const flags = getFlags(initialFieldsWithBombs)

  const hydratedFields: Field[] = []
  initialFieldsWithBombs.forEach(({ id, x, y, state, bomb }) =>
    hydratedFields.push({ id, x, y, state, bomb, bombsInTouch: flags[id - 1] })
  )

  return hydratedFields
}
