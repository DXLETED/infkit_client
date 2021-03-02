import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import { CSSTransition } from 'react-transition-group'

import st from './notifications.sass'
import stAnimation from './notificationsAnimation.sass'

const Notification = ({ id, type, title, text, description, options, duration }) => {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)
  const [initialized, init] = useState(false)
  useEffect(() => {
    setVisible(true)
  }, [])
  return <CSSTransition in={visible} classNames={st} timeout={250} onEntered={() => init(true)} onExited={() => dispatch({type: 'DEL_NOTIFY', id})}>
    <div className={cn(st.ntf, st[type])} onClick={() => type !== 'question' && setVisible(false)}>
      <div className={cn(st.bg, st[type])} />
      {description && <div className={st.description}>{description}</div>}
      {title && <div className={st.title}>{title}</div>}
      {text && <div className={st.content}>{text}</div>}
      {options && <div className={st.options}>{options.map((opt, i) => <div className={st.item} onClick={e => {
        e.stopPropagation()
        opt[1] && opt[1]()
        !opt[2] && setVisible(false)
      }} key={i}>{opt[0]}</div>)}</div>}
      {duration
      ? <div className={st.timeline}>
        <CSSTransition in={initialized} classNames={{enterActive: st.timelineAnimation}} timeout={duration} onEntered={() => setVisible(false)}>
          <div className={st.progress} style={{transition: `${duration}ms linear`}} />
        </CSSTransition>
      </div>
      : <div className={st.notimeline}></div>}
    </div>
  </CSSTransition>
}

export const Notifications = () => {
  const ntfs = useSelector(s => s.ntfs)
  return <div className={st.ntfs}>
    {ntfs.map(ntf => <Notification {...ntf} key={ntf.id} />)}
  </div>
}