import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'

import st from './Tip.sass'

export const Tip = ({children, column}) => {
  const [visible, setVisible] = useState(false),
        ref = useRef(),
        contentRef = useRef(),
        [pos, setPos] = useState([0, 0])
  const onMouseEnter = () => setVisible(true)
  const onMouseLeave = () => setVisible(false)
  const onMouseMove = e => {
    setPos([e.pageX + 20, e.pageY])
  }
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
  return <div className={cn(st.tip, {[st.column]: column})} ref={ref}>
    <div className={cn(st.tipContent, {[st.visible]: visible})} style={{left: pos[0], top: pos[1]}} ref={contentRef}>
      {children}
    </div>
  </div>
}