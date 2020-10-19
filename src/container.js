import React from 'react'
import cn from 'classnames'

export const Container = ({className, mheight, children}) => <div className={cn('container', className, {mheight})}>{children}</div>