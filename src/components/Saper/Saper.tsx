import './styles.css'
import classNames from 'classnames'

import { useSaper } from './useSaper'

export const Saper = () => {
  const { onRightButtonClickAction, handleFirstClick, handleNotFirstClick, count, isWon, hydratedFields } = useSaper()

  return (
    <div className={classNames('box', { 'box-modified': count !== 10 })}>
      {hydratedFields.map(({ state, id, x, y, bomb, bombsInTouch }) =>
        !isWon && (state === 'virgin' || state === 'flagged') ? (
          <button
            key={`field-${id}`}
            aria-label={`button with index x:${x}, y:${y} ${state === 'flagged' ? 'flagged' : 'not flagged'}.`}
            onClick={() => {
              if (hydratedFields[id - 1].state === 'flagged') return

              if (!hydratedFields.some((field) => field.state === 'clicked')) {
                handleFirstClick(id)
                return
              }

              handleNotFirstClick(id)
            }}
            onContextMenu={(e) => {
              e.preventDefault()
              onRightButtonClickAction(id)
            }}
          >
            {state === 'flagged' ? '🚩' : ''}
          </button>
        ) : (
          <div
            key={`field-${id}`}
            className={classNames('box-field', {
              'box-field-exploded': state === 'exploded',
              'box-field-saved': bomb && isWon,
            })}
          >
            {bomb ? '💣' : bombsInTouch === 0 ? '' : bombsInTouch}
          </div>
        )
      )}
    </div>
  )
}
