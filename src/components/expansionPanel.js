import React, { useState, useEffect, useRef } from 'react'
import cn from 'classnames'
import { Component } from './Component'
import { CSSTransition } from 'react-transition-group'

import st from './ExpansionPanel.sass'
import stAnim from './ExpansionPanelAnim.sass'

export const ExpansionPanel = ({open, header, dropdown, disabled, r, onchange, ...props}) => {
  const [isOpen, setIsOpen] = useState(open || false),
        [height, setHeight] = useState(0),
        ref = useRef()
  useEffect(() => {
    setHeight(ref.current.clientHeight)
    onchange?.(isOpen)
  }, [isOpen])
  return (
    <Component cln={cn(st.expansionPanel, {[st.open]: isOpen})}
    rw={[st, ['column', 'p', 'np', 'wrap']]} {...props}>
      <div className={st.header} onClick={() => setIsOpen(!isOpen)}>
        <div className={st.l}>{header}</div>
        <div className={st.r}>
          {r}
          <div className={st.arrow}>{isOpen ? <img src="/static/img/arrow/top.png" /> : <img src="/static/img/arrow/bottom.png" />}</div><div className="border" /></div>
        </div>
      <div className={cn(st.dropdownWr)} style={{height: isOpen && height}}>
        <CSSTransition in={isOpen} classNames={stAnim} timeout={200}>
          <div className={cn(st.dropdown, {disabled})} ref={ref}>{isOpen && dropdown}</div>
        </CSSTransition>
      </div>
    </Component>
  )
}