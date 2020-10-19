import React, { useState, useEffect, useRef } from 'react'
import cn from 'classnames'
import { Scroll } from './scroll'

export const Dropdown = props => {
  const [open, setOpen] = useState(false)
  let ref = useRef()
  let updateScroll = useRef()
  const docClick = e => {
    if (e.target.closest('.dropdown-component')) {
      if (e.target.closest('.dropdown-component') !== ref.current) {
        setOpen(false)
      }
    } else {
      setOpen(false)
    }
  }
  useEffect(() => {
    document.addEventListener('click', docClick)
    return () => document.removeEventListener('click', docClick)
  }, [])
  useEffect(() => {
    updateScroll.current()
  }, [open])
  return (
    <div className={cn('dropdown-component', props.className, {open})} ref={ref}>
      <div className="dropdown-label" onClick={() => setOpen(true)}>{props.children}</div>
      <div className={cn('dropdown-wr', {open})}>
        <Scroll updateScroll={func => updateScroll.current = func}>
          <div className="dropdown">
            {props.dropdown}
          </div>
        </Scroll>
      </div>
    </div>
  )
}