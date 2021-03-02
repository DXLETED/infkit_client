import { useDispatch, useSelector } from 'react-redux'

export const useMenu = n => {
  const s = useSelector(s => s.menus[n])
  const dispatch = useDispatch()
  const open = () => dispatch({type: 'MENU_OPEN', data: n})
  const close = () => dispatch({type: 'MENU_CLOSE', data: n})
  const toggle = () => s ? close() : open()
  return { s, open, close, toggle }
}