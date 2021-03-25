import React, { useState } from 'react'
import { Component } from './Component'
import st from './Dropdown.sass'
import cn from 'classnames'

export const Dropdown2 = ({classNames, label, menu, ...props}) => {
  const [isOpen, setIsOpen] = useState(false)
  return <Component className={cn(classNames[0])} cln={st.dropdown} onClick={() => setIsOpen(!isOpen)} {...props}>
    <div className={cn(st.label, classNames[1])}>
      <div className={st.inner}>{label}</div>
      <img src={`/static/img/arrow/${isOpen ? 'top' : 'bottom'}.png`} />
    </div>
    <div className={cn(st.menu, {[st.open]: isOpen})}>{menu}</div>
  </Component>
}