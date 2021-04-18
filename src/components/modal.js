import React, { useRef, useEffect, useState, memo, useMemo } from 'react'
import ReactDOM from 'react-dom'
import cn from 'classnames'
import { Scroll } from './scroll'
import { CSSTransition } from 'react-transition-group'
import { Memoized } from './Memoized'
import { vh } from './cssVar'
import { useLayout } from '../hooks/layout.hook'
import { throttle } from '../utils/throttle'

export const ModalLabel = props => <div className={cn('modallabel-wr', {enabled: props.enabled === true, switchable: props.enabled !== undefined, m: props.m, disabled: props.disabled})}>
  {props.enabled !== undefined && <div className={cn('ml-enabled', {open: props.enabled})} onClick={() => props.toggle()}><img src={`/static/img/${props.enabled ? 'on' : 'off'}.png`} /></div>}
  <div className={cn('modal-label', {column: props.column, disabled: props.enabled === false})}>
    <div className="ml-type">{props.type}</div>
    {props.children}
  </div>
</div>

export const Modal = ({s, children, title, className, onClick, column, footer}) => {
  const [V1, setV1] = useState(false)
  const [V2, setV2] = useState(false)
  const [linkedPos, setLinkedPos] = useState({loaded: false, x: 0, y: 0, w: 0, h: 0})
  const [pos, setPos] = useState({x: 0, y: 0, align: 'right'})
  const ref = useRef()
  const link = useRef()
  const layout = useLayout()
  const updLinkedPos = useMemo(() => throttle(() => !s.fs && link.current && setLinkedPos({
    loaded: true,
    x: link.current.getBoundingClientRect().x,
    y: link.current.getBoundingClientRect().y,
    w: link.current.clientWidth,
    h: link.current.clientHeight
  }), 1000 / 60), [])
  const updPos = () => {
    if (s.fs) return setTimeout(() => setV2(true))
    if (!s.open || !V1 || !linkedPos.loaded || !ref.current) return
    const width = document.querySelector('page').clientWidth,
          height = document.querySelector('page').clientHeight
    const [x, align] = width - (linkedPos.x + ref.current.clientWidth * 2) < width / 100 * 5
      ? [linkedPos.x - ref.current.clientWidth, 'left']
      : [linkedPos.x + linkedPos.w, 'right']
    const y = linkedPos.y + ref.current.clientHeight > height - height / 100
      ? height - ref.current.clientHeight - height / 100
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
      V1 && <CSSTransition in={V2} appear={V1} classNames="modal-fadein" timeout={200} onExited={() => setV1(false)}>
        {s.fs
          ? <div id={s.id} className="modal-fs-bg" onClick={e => onClick && onClick(e)} ref={ref}>
            <div className="modal-fs-wr" style={{width: s.width && vh(s.width)}}>
              {(title || layout.ap3) && <div className="modal-title">{title}<div className="modal-close" onClick={() => s.close()}>{layout.ap3 && <img src="/static/img/delete.png" />}</div></div>}
              <div className="modal-fs-container">
                <Scroll><div className={cn('modal-fs', className, styles)}>{children}</div></Scroll>
              </div>
              <div className="modal-footer">{footer}</div>
            </div>
          </div>
          : <div id={s.id} className={cn('modal-wr', `align-${pos.align}`, className, styles, {w100: layout.ap3})} style={!layout.ap3 ? {left: pos.x, top: pos.y, width: s.width && vh(s.width)} : {}} onClick={e => onClick && onClick(e)} ref={ref}>
            {(title || layout.ap3) && <div className="modal-title">{title}{layout.ap3 && <img src="/static/img/delete.png" />}</div>}
            <div className="modal-container">
              <Scroll>
                <div className="modal">
                  <Memoized>{children}</Memoized>
                </div>
              </Scroll>
            </div>
            <div className="modal-footer">{footer}</div>
          </div>}
      </CSSTransition>
    , document.querySelector('.modals'))
  )
}