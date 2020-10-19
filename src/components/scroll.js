import React, { useRef, useState, useEffect, memo, useMemo } from 'react'
import cn from 'classnames'
import { useCallbackRef } from 'use-callback-ref'

export const Scroll = memo(props => {
  const scrollRef = useRef()
  const scrollWrRef = useRef()
  const [state, setState] = useState({pos: 0, height: 0, visible: false})
  const ref = useCallbackRef(null, reff => {
    if (reff) {
      const observer = new MutationObserver(() => {
        setState({
          pos: (ref.current.scrollTop / ref.current.scrollHeight) || 0,
          height: (ref.current.clientHeight / (ref.current.scrollHeight / ref.current.clientHeight)) || 0,
          visible: ref.current.clientHeight / (ref.current.scrollHeight / ref.current.clientHeight) < ref.current.clientHeight
        })
      })
      observer.observe(reff, {
        attributes: true,
        childList: false,
        subtree: true
      })
    }
  })
  const updateScroll = useMemo(() => () => {
    if (!ref.current) return
    setState({
      pos: (ref.current.scrollTop / ref.current.scrollHeight) || 0,
      height: (ref.current.clientHeight / (ref.current.scrollHeight / ref.current.clientHeight)) || 0,
      visible: ref.current.clientHeight / (ref.current.scrollHeight / ref.current.clientHeight) < ref.current.clientHeight
    })
  }, [])
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
      {React.cloneElement(props.children, {ref, onScroll: updateScroll, className: cn(props.children.props.className, 'with-scroll', {overflow: state.visible})})}
      {/*<props.children.type {...props.children.props} {...{ref, onScroll: updateScroll, className: cn(props.children.props.className, 'with-scroll', {overflow: state.visible})}} />*/}
      <div className="scroll-wr" ref={scrollWrRef} style={{display: !state.visible && !props.fixed && 'none'}}><div className="scroll" style={{top: `${state.pos * 100}%`, height: state.height, display: state.visible ? 'flex' : 'none'}} ref={scrollRef}></div></div>
    </>
  )
}, (o, n) => o.deps && o.deps === n.deps)