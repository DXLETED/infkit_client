import React, { forwardRef } from 'react'
import cn from 'classnames'

import st from './Component.sass'

const supportedProps = ['style', 'onClick', 'onScroll', 'onMouseEnter', 'onMouseLeave']

export const Component = forwardRef(({cln, className, rw, children, ...props}, ref) => {
  const args = {
    className: cn(st.component, cln, className, props && {
      ...['vpadding', 'hpadding', 'lpadding', 'rpadding', 'vmargin', 'hmargin']
        .map(str => Object.fromEntries([...Array(4)].map((_, i) => [st[str + ((i + 1) * 5)], props[str + ((i + 1) * 5)]])))
        .reduce((acc, p) => ({...acc, ...p}), {}),
      [st.flex]: props.flex,
      [st.jcc]: props.jcc,
      [st.aic]: props.aic,
      [st.jcsb]: props.jcsb,
      [st.jcsa]: props.jcsa,
      [st.w100]: props.w100,
      [st.h100]: props.h100,
      [st.m]: props.m
    }, Array.isArray(rw) && Object.entries(props).filter(([p, state]) => state === true && rw[1].includes(p)).map(([p, state]) => rw[0][p]))
  }
  return <div className={cn(cln, className)} {...args} {...Object.fromEntries(Object.entries(props).filter(([p]) => supportedProps.includes(p)))} ref={ref}>{children}</div>
})