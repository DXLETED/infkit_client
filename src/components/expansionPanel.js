import React, { useState, useEffect } from 'react'
import cn from 'classnames'

export const ExpansionPanel = props => {
  const [open, setOpen] = useState(props.open || false)
  useEffect(() => {
    props.onchange && props.onchange(open)
  }, [open])
  return (
    <div className={cn('expansion-panel', {open, column: props.column, m: props.m, np: props.np, wrap: props.wrap, p: props.p}, props.className)}>
      <div className="ep-header" onClick={() => setOpen(!open)}>
        <div className="ep-header-l">{props.header}</div>
        <div className="ep-header-r">
          {props.r}
          <div className="ep-header-arrow">{open ? <img src="/static/img/arrow-white/top.png" /> : <img src="/static/img/arrow-white/bottom.png" />}</div><div className="border" /></div>
        </div>
      <div className={cn('ep-dropdown', {disabled: props.disabled})}>{open && props.dropdown}</div>
    </div>
  )
}