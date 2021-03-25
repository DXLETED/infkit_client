import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import cn from 'classnames'

import st from './Tip.sass'
import { Component } from './Component'

export const Tip = ({children, className, ...props}) => {
  const [visible, setVisible] = useState(false),
        ref = useRef(),
        contentRef = useRef(),
        [pos, setPos] = useState([0, 0])
  const onMouseEnter = e => {
          setVisible(true)
          setPos([e.pageX + 20, e.pageY])
        },
        onMouseMove = e => {
          setPos([e.pageX + 20, e.pageY])
        },
        onMouseLeave = () => setVisible(false)
  useEffect(() => {
    ref.current.addEventListener('mouseenter', onMouseEnter)
    ref.current.addEventListener('mouseleave', onMouseLeave)
    ref.current.addEventListener('mousemove', onMouseMove)
    return () => {
      ref.current.removeEventListener('mouseenter', onMouseEnter)
      ref.current.removeEventListener('mouseleave', onMouseLeave)
      ref.current.removeEventListener('mousemove', onMouseMove)
    }
  }, [])
  return <div className={st.tip} ref={ref}>
    {ReactDOM.createPortal(
      <Component cln={cn(st.content, className, {[st.visible]: visible})} rw={[st, ['p', 'column']]} style={{left: pos[0], top: pos[1]}} ref={contentRef} {...props}>
        {children}
      </Component>
    , document.querySelector('.overlays'))}
  </div>
}