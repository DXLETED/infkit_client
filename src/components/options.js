import React from 'react'
import cn from 'classnames'
import { MLabel } from './mlabel'

import st from './Options.sass'
import { Switch } from './switch'

export const Options = props => {
  return (
    <div className={cn(st.optionsWr, props.className)}>
      <MLabel d={props.label} bg />
      <div className={st.options}>
        {props.options.map((opt, i) => <Switch enabled={(props.keys ? props.keys[i] : i) === props.selected} set={() => props.set(props.keys ? props.keys[i] : i)} key={i} p m>{opt}</Switch>)}
      </div>
    </div>
  )
}