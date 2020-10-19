import React, { useState, useEffect, useRef, memo } from 'react'
import cn from 'classnames'
import { CustomTime } from './customTime'
import { Input } from './input'
import { Select } from './select'
import { ms } from '../utils/timeFormat'
import { cursorDistance } from '../hooks/cursorDistance'
import equal from 'fast-deep-equal'
import { isEqual } from 'lodash'
import { MLabel } from './mlabel'

export const MultiSwitch = memo(props => {
  const selected = props.selected || {}
  const ref = useRef()
  let vis = cursorDistance(ref, 100)
  return (
    <div className={cn('multi-switch-wr', props.className, {v: vis, m: props.m})}>
      <MLabel d={props.label} />
      <div className="multi-switch" ref={ref}>
        {props.options.map((option, i) => <div className={cn('option', {selected: !selected.custom && i === selected.o})} onClick={() => props.set && props.set({...selected, custom: false, o: i})} key={i}>{option}</div>)}
        {props.custom && (!props.type || props.type === 'string') && <div className={cn('option', 'custom', {selected: selected.custom})}>
          <Input onClick={() => props.set && props.set({...selected, custom: true, v: selected.v})} value={selected.custom && selected.v} set={n => props.set && props.set({...selected, custom: true, v: props.type === 'string' ? n : parseFloat(n)})} placeholder="CUSTOM" limit={props.limit} center nb nm />
        </div>}
        {props.custom && props.type === 'time' && <div className={cn('option', 'custom-time', {selected: selected.custom})}>
          <CustomTime value={selected.v} set={n => props.set({...selected, custom: true, v: n})} min={props.min} max={props.max} activate={() => props.set({...selected, custom: true})} covered={!selected.custom} />
        </div>}
        {props.custom && props.type === 'percentage' && <div className={cn('option', 'custom-percentage', {selected: selected.custom})}>
          <Input onClick={() => props.set && props.set({...selected, custom: true, v: selected.v})} value={selected.custom && selected.v * 100} set={n => props.set && props.set({...selected, custom: true, v: n / 100})} placeholder="CUSTOM" center nb nm />
          <div className="percent">%</div>
        </div>}
        <div className="border"></div>
      </div>
    </div>
  )
}, isEqual)