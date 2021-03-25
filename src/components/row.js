import React from 'react'
import cn from 'classnames'
import { memo } from 'react'
import { isEqual } from 'lodash'
import { isValidElement } from 'react'
import { vh } from './cssVar'

export const Row = memo(props => props.column
  ? props.elements.map((el, i) => isValidElement(el) ? el : el.el)
  : <div className={cn('row', props.className, {m: props.m, aic: props.aic, flex: props.flex, column: props.column})}>{props.elements.map((el, i) =>
    isValidElement(el)
    ? <div className={cn('row__el', el.className)} key={i} style={{flex: 1, marginLeft: el.marginLeft, marginRight: el.marginRight ?? (i !== props.elements.length && props.margin && vh(props.margin))}}>{el}</div>
    : <div className={cn('row__el', el.className, {jcc: el.jcc})} style={{flex: el.width === undefined ? 1 : el.width, marginLeft: el.marginLeft, marginRight: el.marginRight ?? (i !== props.elements.length && props.margin)}} key={i}>{el.el}</div>
  )}</div>
, isEqual)