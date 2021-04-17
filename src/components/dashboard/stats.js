import React, { memo } from 'react'
import cn from 'classnames'
import { Select } from '../select'
import { Graph } from '../graph'
import { useSettings } from '../../hooks/settings.hook'
import { isEqual } from 'lodash'
import moment from 'moment'
import { Tip } from '../Tip'
import { Row2 } from '../Row2'
import { useLayout } from '../../hooks/layout.hook'
import { Chart } from '../Chart'

import st from './Stats.sass'

const periods = [[900000, '15m'], [3600000, '1h'], [86400000, '1d']]

const date = (period, t) => {
  switch (period) {
    case 0: return moment(t * periods[period][0]).format('HH:mm')
    case 1: return moment(t * periods[period][0]).format('HH:mm D MMMM')
    case 2: return moment(t * periods[period][0]).format('D MMMM')
  }
}

const parseMembers1 = (s, period) => Object.entries(s.members.sum[periods[period][1]]).map(([t, d], i, arr) => {
  const add = s.members.join[periods[period][1]][t],
        sub = s.members.leave[periods[period][1]][t]
  return {add, sub, nodata: d === null, tip: <Tip className={st.statsTip} column>
  {d !== null
    ? <div className={st.vals}>
      <div className={st.value}><div className={st.type}>Joins</div>{add}</div>
      <div className={st.value}><div className={st.type}>Leaves</div>{sub}</div>
    </div>
    : <div className={st.nodata}>NO DATA</div>}
    <div className={st.time}>{date(period, t - 1)} - {date(period, t)}</div>
  </Tip>}
})

const parseMembers2 = (s, period) => Object.entries(s.members.sum[periods[period][1]]).map(([t, d], i, arr) => ({vals: [
  s.members.online[periods[period][1]][t],
  s.members.voice[periods[period][1]][t]], tip: <Tip className={st.statsTip} column>
  {d !== null
    ? <div className={st.vals}>
      <div className={st.value}><div className={st.type}>Members</div>{d}</div>
      <div className={st.value}><div className={st.type}>Online</div>{s.members.online[periods[period][1]][t]}</div>
      <div className={st.value}><div className={st.type}>Members in a voice channel</div>{s.members.voice[periods[period][1]][t]}</div>
      <div className={st.value}><div className={st.type}>Bots</div>{s.members.bots[periods[period][1]][t]}</div>
    </div>
    : <div className={st.nodata}>NO DATA</div>}
  <div className={st.time}>{date(period, t)}</div>
</Tip>}))

const parseMessages = (s, period) => Object.entries(s.messages.any[periods[period][1]]).map(([t, d], i, arr) => ({vals: [d, s.messages.commands[periods[period][1]][t]], tip: <Tip className={st.statsTip} column>
  {d !== null
    ? <div className={st.vals}>
      <div className={st.value}><div className={st.type}>Messages</div>{d}</div>
      <div className={st.value}><div className={st.type}>Commands</div>{s.messages.commands[periods[period][1]][t]}</div>
    </div>
    : <div className={st.nodata}>NO DATA</div>}
  <div className={st.time}>{date(period, t - 1)} - {date(period, t)}</div>
</Tip>}))

const StatsItem = memo(({title, state, color, k, defaultStage, diff}) => {
  const [period, setPeriod] = useSettings('stats_period_' + k, defaultStage, {options: ['15m', '1h', '1d']})
  const layout = useLayout()
  return <div className={cn('stat', 'stat-members', {ap3: layout.ap3})}>
    <div className="stat-header"><div className="stat-name">{title}</div><Select type="options" selected={period} set={setPeriod} dropdown={['15 minutes', '1 hour', '1 day']} options={['15m', '1h', '1d']} width={12.5} noborder nm /></div>
    <Chart dataset={state[period]} diff={diff} flex max={k === 'members' ? 2 : 5} min={0} color={color} />
  </div>
})

export const Stats = memo(({visible, state}) => {
  const getArr = st => Object.fromEntries([...Array(3)].map((_, period) => {
          const obj = Object.fromEntries(st[periods[period][1]])
          return [periods[period][1],
            Object.fromEntries([...Array(40)].map((_, i) =>
              [Math.floor(Date.now() / periods[period][0] - 40 + i + 1), obj[Math.floor(Date.now() / periods[period][0] - 40 + i + 1)] ?? null]))
          ]
        })),
        layout = useLayout()
  let s = {
    members: {
      join: getArr(state.members.join),
      leave: getArr(state.members.leave),
      sum: getArr(state.members.sum),
      online: getArr(state.members.online),
      voice: getArr(state.members.voice),
      bots: getArr(state.members.bots)
    },
    messages: {
      any: getArr(state.messages.any),
      commands: getArr(state.messages.commands)
    }
  }
  let data = {
    members1: {'15m': parseMembers1(s, 0), '1h': parseMembers1(s, 1), '1d': parseMembers1(s, 2)},
    members2: {'15m': parseMembers2(s, 0), '1h': parseMembers2(s, 1), '1d': parseMembers2(s, 2)},
    messages: {'15m': parseMessages(s, 0), '1h': parseMessages(s, 1), '1d': parseMessages(s, 2)}
  }
  console.log(s, data)
  /*data = {
    members: {
      join: {
        '15m': [...Array(40)].map(() => 0),
        '1h': [...Array(40)].map(() => 0),
        '1d': [...Array(40)].map(() => 0)
      },
      leave: {
        '15m': [...Array(40)].map(() => 0),
        '1h': [...Array(40)].map(() => 0),
        '1d': [...Array(40)].map(() => 0)
      },
      sum: {
        '15m': [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11,11,11,11,11,11,11,11,11,11],
        '1h': [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11,11,11,11,11,11,11,11,11,11],
        '1d': [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11,11,11,11,11,11,11,11,11,11]
      },
      voice: {
        '15m': [0,0,0,0,0,0,2,4,4,4,4,5,5,5,8,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,6,5,5,2,2,0,0,0,0,1,2,2],
        '1h': [0,0,0,0,0,0,2,4,4,4,4,5,5,5,8,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,6,5,5,2,2,0,0,0,0,1,2,2],
        '1d': [0,0,0,0,0,0,2,4,4,4,4,5,5,5,8,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,6,5,5,2,2,0,0,0,0,1,2,2]
      },
      bots: {
        '15m': [...Array(40)].map(() => 0),
        '1h': [...Array(40)].map(() => 0),
        '1d': [...Array(40)].map(() => 0)
      }
    },
    messages: {
      any: {
        '15m': [0,0,0,0,1,5,10,2,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,5,9,10,16,12,8,0,0,4,1,0,2,4,0,1,1],
        '1h': [0,0,0,0,1,5,10,2,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,5,9,10,16,12,8,0,0,4,1,0,2,4,0,1,1],
        '1d': [0,0,0,0,1,5,10,2,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,5,9,10,16,12,8,0,0,4,1,0,2,4,0,1,1]
      },
      commands: {
        '15m': [0,0,0,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,4,4,0,0,0,0,0,0,0,0,0,1],
        '1h': [0,0,0,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,4,4,0,0,0,0,0,0,0,0,0,1],
        '1d': [0,0,0,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,4,4,0,0,0,0,0,0,0,0,0,1]
      }
    }
  }*/
  return visible
    ? <Row2 className={cn('stats', {ap3: layout.ap3})} els={[
      <StatsItem title="Joins / Leaves" state={data.members1} k="members" defaultStage={'1d'} diff />,
      <StatsItem title="Members" state={data.members2} color={[st.online, st.voice]} k="membersVoice" defaultStage={'15m'} />,
      <StatsItem title="Messages" state={data.messages} color={[st.any, st.commands]} k="messages" defaultStage={'15m'} />
    ]} column={layout.ap3} />
    : <></>
}, isEqual)