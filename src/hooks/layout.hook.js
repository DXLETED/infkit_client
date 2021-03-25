import { isEqual } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { throttle } from '../utils/throttle'

export const useLayout = ({detailed = false, ...breakpoints} = {detailed: false, breakpoints: {}}) => {
  const getAP = () => ({
    ap1: document.body.clientWidth < 1560,
    ap2: document.body.clientWidth < 1260,
    ap3: document.body.clientWidth < 900,
    ap4: document.body.clientWidth < 680
  })
  const getCurrent = s => [s.ap1, s.ap2, s.ap3, s.ap4].lastIndexOf(true) + 1
  const get = () => {
    const s = getAP()
    return {
      ...detailed ? {
        width: document.body.clientWidth,
        heigth: document.body.clientHeight
      } : {},
      touch: (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0)),
      ...Object.fromEntries(Object.entries(breakpoints).map(([n, width]) => [n, document.body.clientWidth < width])),
      ...s, current: getCurrent(s)
    }
  }
  const [state, setState] = useState(get())
  const upd = useMemo(() => throttle(() => setState(prev => {
    const s = get()
    return isEqual(prev, s) ? prev : s
  }), 100), [])
  useEffect(() => {
    window.addEventListener('resize', upd)
    return () => window.removeEventListener('resize', upd)
  }, [])
  return state
}