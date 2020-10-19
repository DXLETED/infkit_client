import React from 'react'
import cn from 'classnames'

export const MLabel = ({d, r, bg}) => (d || r) ? <div className={cn('mlabel', {bg})}><div className="mlabel-left">{d}</div>{r && <div className="mlabel-right">{r}</div>}</div> : <></>