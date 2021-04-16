import React, { useEffect, useState } from 'react'
import st from './Tabs.sass'
import cn from 'classnames'
import { Component } from './Component'
import { Container } from './container'

export const Tabs = ({pages, selected, ...props}) => {
  const [sel, setSel] = useState(selected || pages[0]?.[0])
  useEffect(() => { selected && setSel(selected) }, [selected])
  return <Component cln={st.tabs} {...props}>
    <div className={st.head}>
      {pages.map(([k, title]) => <div className={cn(st.el, {[st.selected]: k === sel})} onClick={() => setSel(k)} key={k}>{title}</div>)}
      <div className={st.pos} style={{width: `${100 / pages.length}%`, left: `${100 * pages.findIndex(([k]) => k === sel) / pages.length}%`}} />
    </div>
    <div className={st.inner} style={{left: `${100 * -pages.findIndex(([k]) => k === sel)}%`}}>
      {pages.map(([k, _, p, props]) => <Container className={cn(st.page, {[st.active]: k === sel})} key={k} noflex {...props}>{p}</Container>)}
    </div>
  </Component>
}