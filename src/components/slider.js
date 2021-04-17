import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { MLabel } from './mlabel'
import { nearest } from '../utils/nearest'
import { Input } from './input'
import { Component } from './Component'

export const Slider = ({value = 0, set, label, icon, keyPoints = 20, modifier = 1, m, noPoints, min, max, compact, ...props}) => {
  if (!Array.isArray(keyPoints))
    keyPoints = [...Array(keyPoints + 1)].map((_, i) => i / (keyPoints))
  const [pos, setPos] = useState(value / modifier)
  const posRef = useRef(value / modifier)
  const startPos = useRef()
  const mouseDown = useRef(false)
  const ref = useRef()
  const inputSet = n => {
    setPos(nearest(n / modifier, keyPoints))
    set(parseFloat((nearest(n, keyPoints)).toFixed(2)))
  }
  const mouseMove = e => {
    if (mouseDown.current && ref.current) {
      const bcr = ref.current.getBoundingClientRect()
      const poss = (e.pageX - bcr.x) / ref.current.clientWidth
      if (poss < 0 || poss < min) return setPos(0)
      if (poss > 1 || poss > max) return setPos(1)
      setPos(poss)
    }
  }
  const mouseOut = () => {
    if (mouseDown.current && ref.current) {
      mouseDown.current = false
      setPos(nearest(posRef.current, keyPoints))
      set(parseFloat((nearest(posRef.current, keyPoints) * modifier).toFixed(2)))
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
  useEffect(() => { setPos(value / modifier) }, [value])
  useEffect(() => { posRef.current = pos }, [pos])
  return <Component className={cn('slider-wr', {row: !!icon, m, compact})} {...props}>
    {!compact && <MLabel d={label} r={<Input value={parseFloat((nearest(pos, keyPoints) * modifier).toFixed(2))} set={inputSet} {...{min, max}} type="number" fill right />} />}
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
  </Component>
}