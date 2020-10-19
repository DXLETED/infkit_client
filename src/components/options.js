import React from 'react'
import cn from 'classnames'
import { MLabel } from './mlabel'

export const Options = props => {
  return (
    <div className={cn('options-wr', props.className)}>
      <MLabel d={props.label} bg />
      <div className="options">
        {props.options.map((opt, i) => <div className={cn('option', {selected: (props.keys ? props.keys[i] : i) === props.selected})} onClick={() => props.set(props.keys ? props.keys[i] : i)} key={i}>{opt}</div>)}
      </div>
    </div>
  )
}