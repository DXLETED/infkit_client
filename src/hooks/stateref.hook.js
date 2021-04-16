import { isEqual } from 'lodash'
import { useCallback, useRef, useState } from 'react'

export const useStateRef = (initialState) => {
  const [state, setState] = useState(initialState),
        ref = useRef(initialState)
  const set = useCallback(val => {
    ref.current = typeof val === 'function' ? val(ref.current) : val
    setState(prev => isEqual(prev, ref.current) ? prev : ref.current)
  })
  return [state, set, ref]
}