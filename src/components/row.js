import React from 'react'
import cn from 'classnames'
import { memo } from 'react'
import { isEqual } from 'lodash'
import { isValidElement } from 'react'
import { vh } from './cssVar'

export const Row = memo(props => <div className={cn('row', props.className, {m: props.m, aic: props.aic})}>{props.elements.map((el, i) =>
  isValidElement(el)
  ? <div className="row__el" key={i} style={{flex: 1, marginRight: i !== props.elements.length && props.margin && vh(props.margin)}}>{el}</div>
  : <div className={cn('row__el', {jcc: el.jcc})} style={{flex: el.width === undefined ? 1 : el.width, marginRight: i !== props.elements.length && props.margin}} key={i}>{el.el}</div>
)}</div>, isEqual)