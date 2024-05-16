import { useSaperContext } from '../../App'
import { Field, OnButtonClickAction } from '../../types'
import { getHydratedFields } from '../../utils'
import { iterateEmptyFields } from './iterateEmptyFields'

export const useSaper = () => {
  const { count, hydratedFields, isWon, setHydratedFields, bombsLeft, setBombsLeft, initialFields, playAreaSize } =
    useSaperContext()

  const onButtonClickAction: OnButtonClickAction = (id, hydratedFields, setHydratedFields) => {
    const editIndex = id - 1
    const clickedField = hydratedFields[editIndex]
    if (clickedField.bomb) {
      const finalView: Field[] = hydratedFields.map((field) => ({
        ...field,
        state: field.id === id ? 'exploded' : 'clicked',
      }))
      setHydratedFields(finalView)
      return
    }

    setHydratedFields((prevFields) => [
      ...prevFields.slice(0, editIndex),
      { ...prevFields[editIndex], state: 'clicked' },
      ...prevFields.slice(editIndex + 1),
    ])
  }

  const onRightButtonClickAction = (id: number) => {
    const editIndex = id - 1

    if (bombsLeft === 0 && hydratedFields[editIndex].state !== 'flagged') return

    setHydratedFields((prevFields) => [
      ...prevFields.slice(0, editIndex),
      {
        ...prevFields[editIndex],
        state: hydratedFields[editIndex].state === 'flagged' ? 'virgin' : 'flagged',
      },
      ...prevFields.slice(editIndex + 1),
    ])

    setBombsLeft((prevState) => (hydratedFields[editIndex].state === 'flagged' ? prevState + 1 : prevState - 1))
  }

  const handleFirstClick = (id: number) => {
    const fieldsAfterFirstClick = getHydratedFields(playAreaSize, count, initialFields, id)
    setHydratedFields(fieldsAfterFirstClick)
    onButtonClickAction(id, fieldsAfterFirstClick, setHydratedFields)
    iterateEmptyFields(id, fieldsAfterFirstClick, setHydratedFields, onButtonClickAction, playAreaSize)
  }

  const handleNotFirstClick = (id: number) => {
    onButtonClickAction(id, hydratedFields, setHydratedFields)
    if (isWon) return
    iterateEmptyFields(id, hydratedFields, setHydratedFields, onButtonClickAction, playAreaSize)
  }

  return {
    onRightButtonClickAction,
    handleFirstClick,
    handleNotFirstClick,
    count,
    isWon,
    hydratedFields,
  }
}
