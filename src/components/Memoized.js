import { isEqual } from 'lodash'
import { memo } from 'react'

export const Memoized = memo(({children}) => children, isEqual)