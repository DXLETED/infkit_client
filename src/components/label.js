import React from 'react'
import cn from 'classnames'

export const Label = props => <div className={cn('label-wr', props.className, {p: props.p, bg: props.bg, border: props.border, mt: props.mt, nm: props.nm, text: props.text})} onClick={e => props.onClick && props.onClick()}>
  <div className="label">{props.children}</div>
</div>