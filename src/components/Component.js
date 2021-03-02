import React from 'react'
import cn from 'classnames'

import st from './Component.sass'

export const Component = ({cln, className, rw, children, ...props}) => {
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
      [st.m]: props.m
    }, Array.isArray(rw) && Object.entries(props).filter(([p, state]) => state === true).map(([p, state]) => rw[p]))
  }
  return <div className={cn(st.component, cln, className)} {...args} {...props}>{children}</div>
}