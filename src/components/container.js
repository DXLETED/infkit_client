import React from 'react'
import cn from 'classnames'
import { vh } from './cssVar'

export const Container = ({children, className, column, center, vcenter, hp1, hp2, vp1, vp2, spaceBetween, noflex, maxh, onClick, onScroll, style}) =>
  <div className={cn('container', className, {column, center, vcenter, hp1, hp2, vp1, vp2, spaceBetween, noflex, maxh})} style={style} onClick={e => onClick?.(e)} onScroll={e => onScroll?.(e)}>{children}</div>