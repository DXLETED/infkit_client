import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { useCallbackRef } from 'use-callback-ref'
import { useModal } from '../hooks/useModal'
import { MLabel } from './mlabel'
import { Modal } from './modal'
import { Row } from './row'
import Color, { hsl, hsv, rgb } from 'color'
import { Input } from './input'

export const ColorPicker = ({c, label, set, m, reset}) => {
  const [color, setColor] = useState(Color(c).string())
  const [mColor, setMColor] = useState(),
        mColorRef = useRef(mColor)
  const [opacity, setOpacity] = useState(Color(c).valpha)
  const [sliderVisible, setSliderVisible] = useState(false)
  const [pos, setPos] = useState({x: Color(c).hsv().color[1] / 100, y: 1 - Color(c).hsv().color[2] / 100}),
        posRef = useRef(pos)
  const openRef = useRef(false)
  const pressedRef = useRef({picker: false, slider: false, opacity: false})
  const pressedRefUpd = n => pressedRef.current = {...pressedRef.current, ...n}
  const draw1 = (canvas, c) => {
    const ctx = canvas.getContext('2d')
    const grad1 = ctx.createLinearGradient(0, 0, canvas.width, 0)
    grad1.addColorStop(0, Color([255,255,255]).hsv())
    grad1.addColorStop(1, hsv(c, 100, 100).hsv())
    ctx.fillStyle = grad1
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const grad2 = ctx.createLinearGradient(0, 0, 0, canvas.height)
    grad2.addColorStop(0, Color([0,0,0,0]).hsv())
    grad2.addColorStop(1, Color([0,0,0]).hsv())
    ctx.fillStyle = grad2
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  const draw2 = canvas => {
    const ctx = canvas.getContext('2d')
    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0)
    ;[...Array(canvas.width)].map((_, w) => {
      grad.addColorStop((w / canvas.width).toFixed(2), hsv(w / canvas.width * 360, 100, 100).string())
    })
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  const draw3 = (canvas, c) => {
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'transparent'
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0)
    grad.addColorStop(0, 'transparent')
    grad.addColorStop(1, Color(c).alpha(1).string() || '#FF0000')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  const getColor = (x, y, canvas) => {
    let c
    if (y >= canvas.height)
      c = '#000000'
    else if (x <= 0 && y <= 0)
      c = '#FFFFFF'
    else if (x >= canvas.width && y <= 0)
      c = hsv(mColorRef.current, 100, 100).string()
    else {
      if (x < 0)
        x = 0
      if (x >= canvas.width)
        x = canvas.width - 1
      if (y < 0)
        y = 0
      const ctx = canvas.getContext('2d')
      const colorData = ctx.getImageData(x, y, 1, 1).data
      c = Color([colorData[0], colorData[1], colorData[2]]).string()
    }
    return c
  }
  const pickerRef = useCallbackRef(null, reff => {
    if (reff) {
      reff.width = reff.clientWidth
      reff.height = reff.clientHeight
      draw1(reff, mColor)
    }
  })
  const sliderRef = useCallbackRef(null, reff => {
    if (reff) {
      reff.width = reff.clientWidth
      reff.height = reff.clientHeight
      draw2(reff)
      setMColor(Color(c || '#FF0000').hsv().color[0])
      setSliderVisible(true)
    } else
      setSliderVisible(false)
  })
  const opacityRef = useCallbackRef(null, reff => {
    if (reff) {
      reff.width = reff.clientWidth
      reff.height = reff.clientHeight
      draw3(reff, color)
    }
  })
  const updColor = c => {
    setColor(c)
    setPos({x: Color(c).hsv().color[1] / 100, y: 1 - Color(c).hsv().color[2] / 100})
    setMColor(Color(c || '#FF0000').hsv().color[0])
    setOpacity(Color(c).valpha)
    pickerRef.current && draw1(pickerRef.current, Color(c || '#FF0000').hsv().color[0])
    opacityRef.current && draw3(opacityRef.current, c)
  }
  const select1 = e => {
    const re = pickerRef.current.getBoundingClientRect()
    let posX = e.pageX - re.x,
        posY = e.pageY - re.y
    if (posX <= 0) posX = 0
    if (posX >= pickerRef.current.width) posX = pickerRef.current.width
    if (posY <= 0) posY = 0
    if (posY >= pickerRef.current.height) posY = pickerRef.current.height
    const nc = getColor(posX, posY, pickerRef.current)
    setColor(nc)
    setPos({x: posX / pickerRef.current.width, y: posY / pickerRef.current.height})
    draw3(opacityRef.current, nc)
  }
  const select2 = e => {
    const re = sliderRef.current.getBoundingClientRect()
    let posX = e.pageX - re.x,
        snc
    if (posX <= 0) posX = 0
    if (posX >= sliderRef.current.width) posX = sliderRef.current.width
    if (posX <= 0)
      snc = 0
    else if (posX >= pickerRef.current.width)
      snc = 360
    else {
      const ctx = sliderRef.current.getContext('2d'),
            sliderColorData = ctx.getImageData(posX, 0, 1, 1).data
      snc = Color([sliderColorData[0], sliderColorData[1], sliderColorData[2]]).hsv().color[0]
    }
    setMColor(snc)
    draw1(pickerRef.current, hsv(snc, 100, 100).string())
    setTimeout(() => {
      const nc = getColor(posRef.current.x * pickerRef.current.width, posRef.current.y * pickerRef.current.height, pickerRef.current)
      setColor(nc)
      draw3(opacityRef.current, nc)
    })
  }
  const select3 = e => {
    const re = opacityRef.current.getBoundingClientRect()
    let posX = e.pageX - re.x,
        o
    if (posX <= 0) posX = 0
    if (posX >= opacityRef.current.width) posX = opacityRef.current.width
    if (posX <= 0)
      o = 0
    else if (posX >= opacityRef.current.width)
      o = 1
    else {
      const ctx = opacityRef.current.getContext('2d'),
            opacityColorData = ctx.getImageData(posX, 0, 1, 1).data
      o = opacityColorData[3] / 255
    }
    setOpacity(o)
  }
  const [mState, open, close] = useModal({width: 35, padding: true, closeIf: () => Object.values(pressedRef.current).every(p => !p), onclose: () => updColor(c)})
  useEffect(() => { openRef.current = mState.open }, [mState.open])
  useEffect(() => { posRef.current = pos }, [pos])
  useEffect(() => { mColorRef.current = mColor }, [mColor])
  useEffect(() => {
    document.addEventListener('mousemove', e => {
      if (!openRef.current) return
      if (pressedRef.current.picker) select1(e)
      else if (pressedRef.current.slider) select2(e)
      else if (pressedRef.current.opacity) select3(e)
    })
    document.addEventListener('mouseup', () => {
      setTimeout(() => pressedRefUpd({picker: false, slider: false, opacity: false}))
    })
  }, [])
  useEffect(() => {
    updColor(c)
  }, [c])
  return <div className={cn('color-picker-wr', {m})}>
    <div className="color-picker-label">{label}</div>
    <div className="color-picker ml" onClick={open}>
      <div className="color-picker-hex" onClick={open}>
        <div className="color-picker-c">{Color(c).hex()}</div>
        <div className="color-picker-opacity">{parseInt(Color(c).valpha * 255)}</div>
      </div>
      <div className="color-picker-bg" style={{background: Color(c).string()}} />
    </div>
    <div className="color-picker-border" onClick={open}></div>
    <Modal s={mState} className="color-picker-modal">
      <div id="c-picker" onMouseDown={e => {
        pressedRefUpd({picker: true})
        select1(e)
      }}>
        <canvas ref={pickerRef} />
        <div className="cursor" style={{left: `${pos.x * 100}%`, top: `${pos.y * 100}%`}} />
      </div>
      <div id="c-slider" onMouseDown={e => {
        pressedRefUpd({slider: true})
        select2(e)
      }}>
        <canvas ref={sliderRef} />
        <div className="cursor" style={(sliderVisible && sliderRef.current) ? {left: mColor / 360 * sliderRef.current.width} : {}} />
      </div>
      <div id="c-opacity" onMouseDown={e => {
        pressedRefUpd({opacity: true})
        select3(e)
      }}>
        <canvas ref={opacityRef} />
        <div className="cursor" style={{left: `${opacity * 100}%`}} />
      </div>
      <Row elements={[
        {width: 3, el: <Input placeholder="#HEX value" value={Color(color).hex()} set={n => Color(n) && updColor(Color(n).hex())} p defsize b m />},
        <Input type="number" placeholder="Opacity" value={parseInt(opacity * 255)} set={n => setOpacity(n / 255)} min={0} max={255} center p defsize b m />
      ]} />
      <Row className="picked" elements={[
        <div className="current-color cp-button" onClick={() => updColor(Color(c).string())} style={{borderColor: Color(c).string()}}>Cancel</div>,
        <div className="selected-color cp-button" onClick={() => set(Color(color).alpha(parseFloat(opacity.toFixed(3))).string())} style={{borderColor: Color(color).alpha(opacity).string()}}>Apply</div>
      ]} m={!!reset} />
      {reset && <div className="reset-color cp-button-wide" onClick={() => updColor(reset)} style={{borderColor: reset}}>Reset</div>}
    </Modal>
  </div>
}