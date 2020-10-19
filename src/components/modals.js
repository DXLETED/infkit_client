import React, { memo, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { useSelector } from 'react-redux'
import { store } from '../store'
import { generateId } from '../utils/generateId'
import { Memoized } from './Memoized'
import { CSSTransition } from 'react-transition-group'

const Modal = memo(({s}) => {
  const [V1, setV1] = useState(false)
  const [V2, setV2] = useState(false)
  const [linkedPos, setLinkedPos] = useState({loaded: false, x: 0, y: 0, w: 0, h: 0})
  const [pos, setPos] = useState({x: 0, y: 0, align: 'right'})
  const ref = useRef()
  const dclick = e => !s.fixed && e.target.closest('body') && (e.target.id !== s.id && !e.target.closest(`[id='${s.id}'`)) && setV1(false)
  const updPos = () => setLinkedPos({
    loaded: true,
    x: s.link.getBoundingClientRect().x,
    y: s.link.getBoundingClientRect().y,
    w: s.link.clientWidth,
    h: s.link.clientHeight
  })
  const keyDown = e => e.keyCode === 27 && setV1(false)
  useEffect(() => {
    updPos()
    setV1(true)
    document.addEventListener('click', dclick)
    document.addEventListener('scroll', updPos, true)
    window.addEventListener('resize', updPos)
    document.addEventListener('keydown', keyDown, true)
    return () => {
      document.removeEventListener('click', dclick)
      document.removeEventListener('scroll', updPos, true)
      window.removeEventListener('resize', updPos)
      document.removeEventListener('keydown', keyDown, true)
    }
  }, [])
  useEffect(() => {
    if (!linkedPos.loaded) return
    const [x, align] = window.innerWidth - (linkedPos.x + ref.current.clientWidth * 2) < window.innerWidth / 100
      ? [linkedPos.x - ref.current.clientWidth, 'left']
      : [linkedPos.x + linkedPos.w, 'right']
    const y = linkedPos.y + ref.current.clientHeight > window.innerHeight - window.innerHeight / 100
      ? window.innerHeight - ref.current.clientHeight - window.innerHeight / 100
      : linkedPos.y
    setPos({x, y, align})
    setV2(true)
  }, [linkedPos])
  useEffect(() => {
    s.closing && setV1(false)
  }, [s.closing])
  return <CSSTransition in={V1 && V2} classNames="modal-fadein" timeout={200} onExited={() => s.close()}>
    {s.fs
      ? <div className="modal-fs-bg" ref={ref}><div id={s.id} className="modal-fs"><Memoized>{s.el}</Memoized></div></div>
      : <div id={s.id} className={cn('modal-wr', `align-${pos.align}`)} style={{left: pos.x, top: pos.y}} ref={ref}>
        {s.title}
        <div className="modal">
          <Memoized>{s.el}</Memoized>
        </div>
      </div>}
  </CSSTransition>
})

export const Modals = () => {
  const state = useSelector(s => s.modals)
  return <div className="modals">
    {state.map(s => <Modal s={s} key={s.id} />)}
  </div>
}

export const createModal = ({fs, el, link, fixed}) => {
  const id = generateId(store.getState().modals.map(m => m.id))
  store.dispatch({type: 'CREATE_MODAL', data: {id, fs, el, link, fixed, close: () => store.dispatch({type: 'DEL_MODAL', id})}})
  return id
}