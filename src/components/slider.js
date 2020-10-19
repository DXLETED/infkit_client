import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { MLabel } from './mlabel'
import { nearest } from '../utils/nearest'

export const Slider = ({value = 0, set, label, icon, keyPoints = 20, m, noPoints, min, max}) => {
  if (!Array.isArray(keyPoints))
    keyPoints = [...Array(keyPoints + 1)].map((_, i) => i / (keyPoints))
  const [pos, setPos] = useState(value)
  const posRef = useRef(value)
  const startPos = useRef()
  const mouseDown = useRef(false)
  const ref = useRef()
  const mouseMove = e => {
    if (mouseDown.current && ref.current) {
      const bcr = ref.current.getBoundingClientRect()
      const poss = (e.pageX - bcr.x) / ref.current.clientWidth
      if (poss < 0 || poss < min) return setPos(min || 0)
      if (poss > 1 || poss > max) return setPos(max || 1)
      setPos(poss)
    }
  }
  const mouseOut = () => {
    if (mouseDown.current && ref.current) {
      mouseDown.current = false
      console.log(nearest(posRef.current, keyPoints))
      setPos(nearest(posRef.current, keyPoints))
      set(nearest(posRef.current, keyPoints))
    }
  }
  useEffect(() => {
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseleave', mouseOut)
    document.addEventListener('mouseup', mouseOut)
    return () => {
      document.removeEventListener('mousemove', mouseMove)
      document.removeEventListener('mouseleave', mouseOut)
      document.removeEventListener('mouseup', mouseOut)
    }
  }, [])
  useEffect(() => { setPos(value) }, [value])
  useEffect(() => { posRef.current = pos }, [pos])
  return <div className={cn('slider-wr', {row: !!icon, m})}>
    <MLabel d={label} />
    {icon && <img src={icon} />}
    <div
      className="slider"
      onMouseDown={e => {
        startPos.current = e.pageX
        mouseDown.current = true
        mouseMove(e)
      }}
      ref={ref}>
      <div className="slider-content">
        <div className="slider-pos" style={{left: `${pos * 100}%`}} />
        {!noPoints && keyPoints.map((k, i) => <div style={{left: `${k * 100}%`}} className={cn('slider-keypoint', {visible: pos < k})} />)}
      </div>
      <div className="slider-fill" style={{width: `${pos * 100}%`}} />
      <div className="slider-unfilled" />
    </div>
  </div>
}