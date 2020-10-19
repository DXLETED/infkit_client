import React from 'react'
import cn from 'classnames'
import { useState } from 'react'
import { useRef } from 'react'
import { memo } from 'react'

export const VideoHover = memo(props => {
  const ref = useRef()
  const [playing, setPlaying] = useState(false)
  return <div {...props}>
    <video className={cn({playing})} onMouseEnter={() => {
      if (ref.current) {
        ref.current.play()
        setPlaying(true)
      }}} onMouseLeave={() => {
        if (ref.current) {
          ref.current.pause()
          setPlaying(false)
        }}} ref={ref} muted loop>
      <source src="/static/img/features/coediting-demo.mp4" />
    </video>
    <div className={cn('hovervideo__overlay', {playing})}>Hover mouse to play</div>
  </div>
})