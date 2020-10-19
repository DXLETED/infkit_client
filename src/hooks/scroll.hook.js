import { useEffect } from "react"
import { useState } from "react"

export const useScroll = (ref, throttle = 1, min = 0, max = Infinity) => {
  const [top, setTop] = useState(0)
  const update = e => e.target === (typeof ref === 'string' ? document.querySelector(ref) : ref.current) && setTop(s => {
    if (e.target.scrollTop % throttle === 0) {
      if (e.target.scrollTop <= min)
        return min
      if (e.target.scrollTop >= max)
        return max
      return e.target.scrollTop
    } else return s
  })
  useEffect(() => {
    document.addEventListener('scroll', update, true)
    document.addEventListener('resize', update)
    return () => {
      document.removeEventListener('scroll', update, true)
      document.removeEventListener('resize', update)
    }
  }, [])
  return top
}