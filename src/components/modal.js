import React, { useRef, useEffect, useState, memo } from 'react'
import ReactDOM from 'react-dom'
import cn from 'classnames'
import { Scroll } from './scroll'
import { CSSTransition } from 'react-transition-group'
import { Memoized } from './Memoized'
import { vh } from './cssVar'

export const ModalLabel = props => <div className={cn('modallabel-wr', {enabled: props.enabled === true, switchable: props.enabled !== undefined, m: props.m, disabled: props.disabled})}>
  {props.enabled !== undefined && <div className={cn('ml-enabled', {open: props.enabled})} onClick={() => props.toggle()}><img src={`/static/img/${props.enabled ? 'on' : 'off'}.png`} /></div>}
  <div className={cn('modal-label', {column: props.column, disabled: props.enabled === false})}>
    <div className="ml-type">{props.type}</div>
    {props.children}
  </div>
</div>

export const Modal = ({s, children, title, className, onClick, column}) => {
  const [V1, setV1] = useState(false)
  const [V2, setV2] = useState(false)
  const [linkedPos, setLinkedPos] = useState({loaded: false, x: 0, y: 0, w: 0, h: 0})
  const [pos, setPos] = useState({x: 0, y: 0, align: 'right'})
  const ref = useRef()
  const link = useRef()
  const updLinkedPos = () => link.current && setLinkedPos({
    loaded: true,
    x: link.current.getBoundingClientRect().x,
    y: link.current.getBoundingClientRect().y,
    w: link.current.clientWidth,
    h: link.current.clientHeight
  })
  const updPos = () => {
    if (!s.open || !V1 || !linkedPos.loaded || !ref.current) return
    const [x, align] = window.innerWidth - (linkedPos.x + ref.current.clientWidth * 2) < window.innerWidth / 100 * 5
      ? [linkedPos.x - ref.current.clientWidth, 'left']
      : [linkedPos.x + linkedPos.w, 'right']
    const y = linkedPos.y + ref.current.clientHeight > window.innerHeight - window.innerHeight / 100
      ? window.innerHeight - ref.current.clientHeight - window.innerHeight / 100
      : linkedPos.y
    setPos({x, y, align})
    setV2(true)
  }
  useEffect(() => {
    updLinkedPos()
    document.addEventListener('scroll', updLinkedPos, true)
    window.addEventListener('resize', updLinkedPos)
    return () => {
      document.removeEventListener('scroll', updLinkedPos, true)
      window.removeEventListener('resize', updLinkedPos)
    }
  }, [])
  useEffect(() => {
    updLinkedPos()
    if (s.open) setV1(true)
    else setV2(false)
  }, [s.open])
  useEffect(() => {
    link.current = s.link
    !V2 && updLinkedPos()
  }, [s.link])
  useEffect(() => {
    updPos()
  }, [linkedPos, V1])
  const styles = {list: s.list, p: s.padding, column}
  return (
    ReactDOM.createPortal(
      V1 && <CSSTransition in={V2} classNames="modal-fadein" timeout={200} onExited={() => setV1(false)}>
        {s.fs
          ? <div id={s.id} className="modal-fs-bg" onClick={e => onClick && onClick(e)} ref={ref}>
            <div className="modal-fs-wr">
              {title && <div className="modal-title">{title}</div>}
              <div className="modal-fs-container">
                <Scroll><div className={cn('modal-fs', className, styles)}>{children}</div></Scroll>
              </div>
            </div>
          </div>
          : <div id={s.id} className={cn('modal-wr', `align-${pos.align}`, className, styles)} style={{left: pos.x, top: pos.y, width: vh(s.width)}} onClick={e => onClick && onClick(e)} ref={ref}>
            {title && <div className="modal-title">{title}</div>}
            <div className="modal-container">
              <Scroll>
                <div className="modal">
                  <Memoized>{children}</Memoized>
                </div>
              </Scroll>
            </div>
          </div>}
      </CSSTransition>
    , document.querySelector('.modals'))
  )
}