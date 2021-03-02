import React, { Fragment, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { MLabel } from './mlabel'
import { memo } from 'react'
import { isEqual } from 'lodash'

import st from './customTime.sass'

const periods = [
  [40, 25, 'ms', 1],
  [60, 1, 's', 1000],
  [60, 1, 'm', 60000],
  [24, 1, 'h', 3600000],
  [28, 1, 'd', 86400000],
  [52, 1, 'W', 604800000],
  [10, 1, '~Y', 31449600000],
  [null, null, null, Infinity]
]

const TimeSelect = memo(({value, period, set, setMinPeriod, min, max} = {}) => {
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)
  const dropdown = [...Array(periods[period][0])].map((_, i) => i * periods[period][1])
  const ending = periods[period][2]
  const ref1 = useRef(),
        ref2 = useRef()
  const multiplier = periods[period][3]
  const nextMultiplier = period + 1 in periods ? periods[period + 1][3] : periods[periods.length - 1][3]
  const docClick = e => {
    const timeSelectPeriod = e.target.closest('.time-select_period')
    const timeSelectFormat = e.target.closest('.time-select_format')
    if (!timeSelectPeriod || timeSelectPeriod !== ref1.current)
      setOpen1(false)
    if (!timeSelectFormat || timeSelectFormat !== ref2.current)
      setOpen2(false)
  }
  useEffect(() => {
    document.addEventListener('click', docClick, true)
    return () => document.removeEventListener('click', docClick)
  }), []
  const val = Math.floor(value % nextMultiplier / multiplier)
  return <>
    <div className={cn(st.timeSelect, st.timeSelect_period)} ref={ref1}>
      <div className={st.selected} onClick={() => setOpen1(true)}>{Math.floor(value % nextMultiplier / multiplier)}</div>
      <div className={cn(st.dropdown, {[st.v]: open1})}>
        <div className={cn(st.dropdownInner, 'withScroll')}>
          {dropdown
            .filter(amount => (min === undefined || min <= value - val * multiplier + amount * multiplier) && (max === undefined || max >= value - val * multiplier + amount * multiplier))
            .map(amount => <div className={st.item} onClick={() => {
              set(value - val * multiplier + amount * multiplier)
              setOpen1(false)
            }
          } key={amount * multiplier}>{amount}</div>)}
        </div>
      </div>
    </div>
    <div className={cn(st.timeSelect, st.timeSelect_format)} ref={ref2}>
      <div className={st.selected} onClick={() => setOpen2(true)}>{ending}</div>
      <div className={cn(st.dropdown, {[st.v]: open2})}>
        <div className={cn(st.dropdownInner, 'withScroll')}>
          {periods
            .map((per, i) => (min === undefined || min <= per[0] * per[1] * per[3]) && (max === undefined || max >= per[3])
            ? <div className={st.item} onClick={() => {
                const pre = val * per[3]
                setMinPeriod(i)
                setOpen2(false)
                if (pre < min) return set(min)
                if (pre > max) return set(max)
                set(val * per[3])
              }
            } key={i * per[3]}>{per[2]}</div>
            : <Fragment key={i} />)}
        </div>
      </div>
    </div>
  </>
}, isEqual)

export const CustomTime = memo(({value, label, set, covered, activate, border, min, max = 86400000, defsize, b, m}) => {
  const [minPeriod, setMinPeriod] = useState(0)
  return (
    <div className={cn(st.customTime, {[st.border]: border, [st.defsize]: defsize, [st.border_bottom]: b, [st.m]: m})}>
      <MLabel d={label} />
      <div className={st.customTimeInner}>
        {covered
        ? <div className={st.cover} onClick={() => activate()}>CUSTOM TIME</div>
        : <>
          {(value >= 31449600000 || minPeriod >= 6) && <TimeSelect value={value} period={6} set={set} setMinPeriod={setMinPeriod} min={min} max={max} />}
          {(value >= 604800000 || minPeriod >= 5) && <TimeSelect value={value} period={5} set={set} setMinPeriod={setMinPeriod} min={min} max={max} />}
          {(value >= 86400000 || minPeriod >= 4) && <TimeSelect value={value} period={4} set={set} setMinPeriod={setMinPeriod} min={min} max={max} />}
          {(value >= 3600000 || minPeriod >= 3) && <TimeSelect value={value} period={3} set={set} setMinPeriod={setMinPeriod} min={min} max={max} />}
          {(value >= 60000 || minPeriod >= 2) && <TimeSelect value={value} period={2} set={set} setMinPeriod={setMinPeriod} min={min} max={max} />}
          {(value >= 1000 || minPeriod >= 1) && <TimeSelect value={value} period={1} set={set} setMinPeriod={setMinPeriod} min={min} max={max} />}
          <TimeSelect value={value} period={0} set={set} setMinPeriod={setMinPeriod} min={min} max={max} />
        </>}
      </div>
    </div>
  )
}, isEqual)