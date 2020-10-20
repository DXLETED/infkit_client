import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { Select } from './select'
import { Scroll } from './scroll'
import { MLabel } from './mlabel'

export const Input = props => {
  const [target, setTarget] = useState(false)
  const ref = useRef()
  const prevValue = useRef()
  useEffect(() => {
    ref.current.value = (props.value !== undefined && props.value !== false) ? props.value : ''
    prevValue.current = ''
  }, [props.value])
  useEffect(() => {
    if (props.clear && ref.current) ref.current.value = ''
    prevValue.current = ''
  }, [props.clear])
  useEffect(() => {
    props.addFn && props.addFn(n => ref.current.value += n)
  })
  const clear = () => {
    if (ref.current) ref.current.value = ''
  }
  return (
    <div className={cn('input', props.className, {b: props.b, m: props.m, center: props.center, oe: props.oe, fill: props.fill, black: props.black, bold: props.bold})}>
      <MLabel d={props.label} />
      <input ref={ref} onInput={e => {
          if (props.type === 'number') {
            e.target.value = parseInt(e.target.value) || 0
          }
          if (props.limit && e.target.value.length > props.limit)
            return e.target.value = e.target.value.slice(0, props.limit)
        }} onKeyUp={e => {
          if (e.keyCode === 13) {
            e.target.blur()
          } else {
            props.input && e.target.value !== prevValue.current && props.input(e.target.value)
            prevValue.current = e.target.value
          }
      }} onBlur={e => {
        if (props.min !== undefined && e.target.value < props.min)
          e.target.value = props.min
        if (props.max !== undefined && e.target.value > props.max)
          e.target.value = props.max
        props.set && props.set(props.type === 'number' ? parseInt(e.target.value) : e.target.value)
        props.clearOnSet && clear()
        setTarget(false)
      }} placeholder={props.placeholder} onClick={props.onClick} spellCheck={false} onFocus={() => setTarget(true)} size={1} />
      {props.dropdown && <div className={cn('input__dropdown_wr', {visible: target && props.dropdownVisible})}>
        <Scroll>
          <div className="input__dropdown">
            {props.dropdown.map((item, i) => <div className="input__dropdown__item" onClick={() => props.ddset && props.ddset(i)} key={i}>{item}</div>)}
          </div>
        </Scroll>
      </div>}
    </div>
  )
}