import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

export const useServerTime = delay => {
  const timesync = useSelector(s => s.timesync)
  const [ts, setTs] = useState(Date.now() + timesync)
  const interval = useRef()
  useEffect(() => {
    interval.current = setInterval(() => setTs(prev => prev + delay), delay)
    return () => clearInterval(interval.current)
  }, [])
  return ts
}