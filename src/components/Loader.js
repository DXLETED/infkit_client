import React, { useEffect, useRef, useState } from 'react'
import { load } from 'react-cookies'

import st from './Loader.sass'

export const Loader = ({text, loaded, load, loadedText, trig = 0.5, timeout = 1000}) => {
  const ref = useRef()
  const [isLoading, setIsLoading] = useState(false)
  const isLoadingRef = useRef(false)
  const loadedRef = useRef(loaded)
  useEffect(() => { isLoadingRef.current = isLoading }, [loaded])
  useEffect(() => { loadedRef.current = loaded }, [isLoading])
  const onScroll = async () => {
    if (!loadedRef.current && !isLoadingRef.current && (ref.current.getBoundingClientRect().top - window.innerHeight) / window.innerHeight <= trig) {
      setIsLoading(true)
      await load?.()
      setTimeout(() => setIsLoading(false), timeout)
    }
  }
  useEffect(() => {
    document.addEventListener('scroll', onScroll, true)
    return () => document.removeEventListener('scroll', onScroll, true)
  }, [])
  return <div className={st.loader} ref={ref}>
    {loaded
      ? loadedText
      : isLoading ? (text || 'PLEASE, WAIT') : <></>}
  </div>
}