import { useEffect, useRef } from 'react'

import { useSaperContext } from '../../App'
import { Field } from '../../types'

export const useTimer = () => {
  const { countDown, setCountDown, isExploded, startTimer, isWon, hydratedFields, setHydratedFields } =
    useSaperContext()

  const intervalId = useRef<number | undefined>(undefined)

  const timeLeft = [
    { number: Math.floor((countDown / 1000 / 60) % 60), measure: 'min' },
    { number: Math.floor((countDown / 1000) % 60), measure: 's' },
  ]

  useEffect(() => {
    intervalId.current = setInterval(() => {
      setCountDown((previousTime) => previousTime - 1000)
    }, 1000)

    return () => clearInterval(intervalId.current)
  }, [startTimer, setCountDown])

  useEffect(() => {
    if (countDown <= 0 || isExploded || isWon) {
      clearInterval(intervalId.current)
      if (countDown <= 0) {
        const finalView: Field[] = hydratedFields.map((field) => ({
          ...field,
          state: 'clicked',
        }))
        setHydratedFields(finalView)
      }
    }
  }, [countDown, isExploded, isWon])
  return { timeLeft }
}
