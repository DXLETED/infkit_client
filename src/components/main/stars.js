import React, { memo } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useCallbackRef } from 'use-callback-ref'
import { useScroll } from '../../hooks/scroll.hook'
import cn from 'classnames'

import st from './Stars.sass'
import { useLayout } from '../../hooks/layout.hook'

const StarsCanvas = memo(({parallaxLeft, parallaxTop, radius, amount}) => {
  const stars = useRef()
  const genStars = amount => {
    const r = [...Array(amount)].map(() => ({x: Math.random(), y: Math.random()}))
    stars.current = r
    return r
  }
  const draw = (ctx, x, y, radius) => {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fill()
  }
  const render = (canvas, stars) => {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'white'
    stars.map(e => {
      let x = e.x * canvas.width,
          y1 = e.y * (canvas.height / 2),
          y2 = e.y * (canvas.height / 2) + (canvas.height / 2)
      draw(ctx, x, y1, radius)
      draw(ctx, x, y2, radius)
    })
  }
  const ref = useCallbackRef(null, n => render(n, genStars(amount)))
  const updateCanvas = () => {
    ref.current && render(ref.current, stars.current || genStars(amount))
  }
  useEffect(() => {
    window.addEventListener('resize', updateCanvas)
    return () => window.removeEventListener('resize', updateCanvas)
  }, [])
  return <canvas ref={ref} className={st.fieldParallax} style={{transform: `translate(${parallaxLeft * 1}%, ${parallaxTop * 1}%)`}} />
})

export const Stars = memo(() => {
  const [parallaxLeft, setParallaxLeft] = useState(0)
  const [parallaxTop, setParallaxTop] = useState(0)
  const scrollTop = useScroll('.page#main > .main', 2, 0, 200)
  const layout = useLayout()
  const updateStars = e => {
    setParallaxLeft(e.pageX / window.innerWidth - 0.5)
    setParallaxTop(e.pageY / window.innerHeight - 0.5)
  }
  useEffect(() => {
    document.addEventListener('mousemove', updateStars)
    return () => document.removeEventListener('mousemove', updateStars)
  }, [])
  return <div className={st.stars} style={{opacity: ((200 - scrollTop) / 200) * (layout.ap3 ? 0.4 : 1)}}>
    <div className={cn(st.field, st.range3)}>
      <StarsCanvas parallaxLeft={parallaxLeft} parallaxTop={parallaxTop} radius={1} amount={300} />
    </div>
    <div className={cn(st.field, st.range2)}>
      <StarsCanvas parallaxLeft={parallaxLeft * 2} parallaxTop={parallaxTop * 2} radius={2} amount={50} />
    </div>
    <div className={cn(st.field, st.range1)}>
      <StarsCanvas parallaxLeft={parallaxLeft * 5} parallaxTop={parallaxTop * 5} radius={3} amount={20} />
    </div>
  </div>
})