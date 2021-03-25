import React from 'react'
import cn from 'classnames'

export const MLabel = ({d, r, m, bg}) => (d || r) ? <div className={cn('mlabel', {m, bg})}><div className="mlabel-left">{d}</div>{r !== undefined && <div className="mlabel-right">{r}</div>}</div> : <></>