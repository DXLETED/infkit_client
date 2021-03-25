import React, { useRef, useState, useEffect, memo, useMemo } from 'react'
import cn from 'classnames'
import { useCallbackRef } from 'use-callback-ref'

import st from './Scroll.sass'
import { Memoized } from './Memoized'
import { throttle } from '../utils/throttle'

export const Scroll = memo(props => {
  const scrollRef = useRef()
  const scrollWrRef = useRef()
  const [state, setState] = useState({pos: 0, height: 0, visible: false})
  const upd = useMemo(() => ref => {
    setState({
      pos: (ref.scrollTop / ref.scrollHeight) || 0,
      height: (ref.clientHeight / (ref.scrollHeight / ref.clientHeight)) || 0,
      visible: ref.clientHeight / (ref.scrollHeight / ref.clientHeight) < ref.clientHeight
    })
  }, [])
  const ref = useCallbackRef(null, reff => {
    if (reff) {
      const observer = new MutationObserver(() => {
        upd(reff)
      })
      observer.observe(reff, {
        attributes: true,
        childList: false,
        subtree: true
      })
    }
  })
  const updateScroll = useMemo(() => throttle(() => {
    if (!ref.current) return
    upd(ref.current)
  }, 1000 / 60), [])
  useEffect(() => {
    updateScroll()
  }, [props.deps])
  useEffect(() => {
    props.reff && props.reff(ref)
    window.addEventListener('resize', updateScroll)
    return () => window.removeEventListener('resize', updateScroll)
  }, [])
  props.updateScroll && props.updateScroll(updateScroll)
  return (
    <>
      {/*React.cloneElement(props.children, {ref, onScroll: updateScroll, className: cn(props.children.props.className, 'with-scroll', {overflow: state.visible})})*/}
      <div className={cn(st.withScroll, props.className, {overflow: state.visible, [st.column]: props.column, [st.relative]: props.relative})} onScroll={updateScroll} ref={ref}><Memoized>{props.children}</Memoized></div>
      {/*<props.children.type {...props.children.props} {...{ref, onScroll: updateScroll, className: cn(props.children.props.className, 'with-scroll', {overflow: state.visible})}} />*/}
      <div className={cn(st.scrollWr, {[st.pl]: props.pl})} ref={scrollWrRef} style={{display: !state.visible && !props.fixed && 'none'}}><div className={st.scroll} style={{top: `${state.pos * 100}%`, height: state.height, display: state.visible ? 'flex' : 'none'}} ref={scrollRef}></div></div>
    </>
  )
}, (o, n) => o.deps && o.deps === n.deps)