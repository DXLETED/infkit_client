import { useDispatch, useSelector } from 'react-redux'

export const useSettings = (k, dflt, {options = null} = {}) => {
  let state = useSelector(s => s.settings[k])
  const dispatch = useDispatch()
  if (state === undefined || (options && !options.includes(state))) {
    dispatch({type: 'SETTINGS_KEY', key: k, data: dflt})
    state = dflt
  }
  const set = n => dispatch({type: 'SETTINGS_KEY', key: k, data: n})
  return [state, set]
}