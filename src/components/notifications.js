import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import { CSSTransition } from 'react-transition-group'

const Notification = ({ id, type, title, text, description, options, duration }) => {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)
  const [initialized, init] = useState(false)
  useEffect(() => {
    setVisible(true)
  }, [])
  return <CSSTransition in={visible} classNames="ntf-in" timeout={250} onEntered={() => init(true)} onExited={() => dispatch({type: 'DEL_NOTIFY', id})}>
    <div className={cn('ntf', type)} onClick={() => type !== 'question' && setVisible(false)}>
      <div className={cn('ntf__bg', type)} />
      {description && <div className="ntf__description">{description}</div>}
      {title && <div className="ntf__title">{title}</div>}
      {text && <div className="ntf__content">{text}</div>}
      {options && <div className="ntf__options">{options.map((opt, i) => <div className="ntf__options__item" onClick={e => {
        e.stopPropagation()
        opt[1] && opt[1]()
        !opt[2] && setVisible(false)
      }} key={i}>{opt[0]}</div>)}</div>}
      {duration
      ? <div className="ntf__timeline">
        <CSSTransition in={initialized} classNames="ntf-progress-animation" timeout={duration} onEntered={() => setVisible(false)}>
          <div className="ntf__timeline__progress" style={{transition: `${duration}ms linear`}} />
        </CSSTransition>
      </div>
      : <div className="ntf__notimeline"></div>}
    </div>
  </CSSTransition>
}

export const Notifications = () => {
  const ntfs = useSelector(s => s.ntfs)
  return <div className="ntfs">
    {ntfs.map(ntf => <Notification {...ntf} key={ntf.id} />)}
  </div>
}