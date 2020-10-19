import React from 'react'
import cn from 'classnames'

export const Enabled = ({state, set, text}) => <div className={cn('enabled-switch', {enabled: state, text})} onClick={e => {set(!state); e.stopPropagation()}}><img src={`/static/img/${state ? 'enabled' : 'disabled'}.png`} />{text && (state ? 'Enabled' : 'Disabled')}</div>