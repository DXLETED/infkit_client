import React from 'react'
import st from './Chart.sass'
import cn from 'classnames'
import { Component } from './Component'

export const Chart = ({dataset, color, diff, ...props}) => {
  let max = Math.max(...(diff ? dataset.map(d => Math.max(d.add, d.sub)) : dataset.map(d => Math.max(...d.vals.map(v => v || 0))))),
      min = diff ? 0 : Math.min(...dataset.map(d => Math.min(...d.vals.map(v => v || 0))))
  if (max < props.max) max = props.max
  if (min > props.min) min = props.min
  return <Component cln={st.chart} {...props}>
    {(dataset.map(d => <div className={st.el}>
      <div className={cn(st.inner, {[st.diff]: diff, [st.normal]: !diff, [st.nodata]: diff ? d.nodata : d.vals.every(v => v === null)})}>
        {diff
          ? <>
              <div className={st.add}>
                <div className={st.data} style={{height: `${d.add / (max - min) * 100}%`}} />
              </div>
              <div className={st.center} />
              <div className={st.sub}>
                <div className={st.data} style={{height: `${d.sub / (max - min) * 100}%`}} />
              </div>
            </>
          : <>
            <div className={st.value}>
              {d.vals.map((v, i) => <div className={st.data} style={{height: `${v / (max - min) * 100}%`, background: Array.isArray(color) ? color[i] : color}} />)}
            </div>
            <div className={st.min} />
          </>}
      </div>
      {d.tip}
    </div>))}
  </Component>
}