import { useEffect, useState, useRef, useMemo } from 'react'
import { generateId } from '../utils/generateId'

export const useModal = ({initState = false, fixed = false, fullScreen = false, list = false, padding = true, width, onopen, onclose, onclosed, closeIf} = {}) => {
  const [vis, setVis] = useState(initState)
  const visRef = useRef(initState)
  const id = useMemo(() => generateId(), [])
  const [link, setLink] = useState()
  const dclick = e => (!closeIf || closeIf(e) === true) && visRef.current && e.target.closest('body') && e.target.tagName !== 'INPUT' && ((fixed || fullScreen)
    ? (!e.target.closest('.modal-fs-wr') && !e.target.closest('.modal') && setVis(false))
    : (e.target.id !== id && !e.target.closest(`[id='${id}'`)) && setVis(false))
  const keyDown = e => visRef.current && e.keyCode === 27 && setVis(false)
  useEffect(() => {
    document.addEventListener('click', dclick)
    document.addEventListener('keydown', keyDown, true)
    return () => {
      document.removeEventListener('click', dclick)
      document.removeEventListener('keydown', keyDown, true)
    }
  }, [])
  useEffect(() => {
    onopen && !visRef.current && vis && onopen()
    onclose && visRef.current && !vis && onclose()
    setTimeout(() => visRef.current = vis)
    if (onclosed && visRef.current && !vis)
      setTimeout(() => onclosed(), 200)
  }, [vis])
  const open = e => {
    let ml = e.target.closest('.ml')
    console.log('OPEN', ml)
    setLink(ml || e.target)
    setVis(true)
  }
  const close = () => {
    setVis(false)
  }
  return [{id, open: vis, link, fs: fullScreen, fixed, width, list, padding}, open, close]
}