import React from 'react'
import cn from 'classnames'
import { Component } from './Component'
import st from './Row2.sass'
import { Container } from './container'

export const Row2 = ({els, column, r, c, ...props}) => {
  const es = (els || []).filter(Boolean)
  return <Component cln={cn(st.row, {[st.column]: column})} {...{column}} {...props}>
    {es.map((el, i) => Array.isArray(el)
      ? <Container className={cn(st.rowEl, {[st.column]: column})} {...el[1]} style={{
        ...el[1]?.style,
        ...(i !== es.length - 1 && (column ? c : r)),
        ...(column ? el[1]?.c : el[1]?.r),
        flex: column ? 0 : el[1]?.flex,
        ...(el[1]?.row ? {flexDirection: 'row'} : {})
      }} noflex={column || el[1]?.flex === 0}>{el[0]}</Container>
      : <Container className={cn(st.rowEl, {[st.column]: column})} column>{el}</Container>)}
  </Component>
}