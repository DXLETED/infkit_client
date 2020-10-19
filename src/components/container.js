import React from 'react'
import cn from 'classnames'
import { vh } from './cssVar'

export const Container = ({children, column, width, center, vcenter, hp1, hp2, vp1, vp2, spaceBetween, noflex, onClick}) =>
  <div className={cn('container', {column, center, vcenter, hp1, hp2, vp1, vp2, spaceBetween, noflex})} style={{width: width && vh(width)}} onClick={e => onClick && onClick(e)}>{children}</div>