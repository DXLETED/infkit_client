import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { Scroll } from './scroll'
import { MLabel } from './mlabel'

import st from './Input.sass'

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
  }, [])
  const clear = () => {
    if (ref.current) ref.current.value = ''
  }
  return (
    <div className={cn(st.input, props.className, {[st.b]: props.b, [st.m]: props.m, [st.p]: props.p, [st.center]: props.center, [st.oe]: props.oe, [st.fill]: props.fill, [st.black]: props.black, [st.bold]: props.bold, [st.defsize]: props.defsize, [st.right]: props.right})}>
      <MLabel d={props.label} />
      <input ref={ref} onInput={e => {
          props.input && e.target.value !== prevValue.current && props.input(e.target.value)
          if (props.limit && e.target.value.length > props.limit)
            return e.target.value = e.target.value.slice(0, props.limit)
        }} onKeyUp={e => {
          if (e.keyCode === 13) {
            e.target.blur()
          } else {
            prevValue.current = e.target.value
          }
      }} onBlur={e => {
        if (props.min !== undefined && e.target.value < props.min)
          e.target.value = props.min
        if (props.max !== undefined && e.target.value > props.max)
          e.target.value = props.max
        props.set && props.set(props.type === 'number' ? parseFloat(e.target.value) : e.target.value)
        props.clearOnSet && clear()
        setTimeout(() => !ref.current.hasFocus && setTarget(false), 500)
      }} placeholder={props.placeholder} onMouseUp={e => {
        if (props.right) {
          e.target.selectionStart = e.target.value.length
          e.target.selectionEnd = e.target.value.length
        }
      }} onClick={e => props.onClick?.()} spellCheck={false} onFocus={() => setTarget(true)} size={1} />
      {props.dropdown && <div className={cn(st.dropdownWr, {[st.visible]: target && props.dropdownVisible})}>
        <Scroll>
          <div className={st.dropdown}>
            {props.dropdown.map((item, i) => <div className={st.item} onClick={() => props.ddset && props.ddset(i)} key={i}>{item}</div>)}
          </div>
        </Scroll>
      </div>}
    </div>
  )
}