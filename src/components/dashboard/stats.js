import React, { memo } from 'react'
import { Select } from '../select'
import { Graph } from '../graph'
import { useSettings } from '../../hooks/settings.hook'
import { isEqual } from 'lodash'
import moment from 'moment'
import { Tip } from '../Tip'

const periods = [300000, 3600000, 86400000]

const StatsItem = memo(({title, state, color, k}) => {
  const [period, setPeriod] = useSettings('stats_period_' + k, 0, {options: [0, 1, 2]})
  return <div className="stat stat-members">
    <div className="stat-header"><div className="stat-name">{title}</div><Select selected={period} set={setPeriod} dropdown={['5 minutes', '1 hour', '1 day']} width={12.5} noborder nm /></div>
    <Graph type="css"
      dataset={state[period].map(s => s || 0)}
      color={color}
      margin={0}
      alert={state[period].find(el => el !== undefined) === undefined && 'Not enough data'}
      tips={state[period].map((d, i) => <Tip column>
        {d === undefined
          ? 'NO DATA'
          : <>
            <div>{moment(Math.floor(Date.now() / periods[period] - (state[period].length - i)) * periods[period]).format('HH:mm')} - {moment(Math.floor(Date.now() / periods[period] - (state[period].length - i - 1)) * periods[period]).format('HH:mm')}</div>
            <div>{d} messages</div>
          </>}
      </Tip>)}
      min={0} />
  </div>
})

export const Stats = memo(({visible, state}) => {
  const getData = (type, period) => [...Array(40)]
    .map((_, i) => i - 39)
    .map(mp => state[type][period]
      .find(([ts, v]) => ts === Math.floor(Date.now() / periods[period] + mp)))
    .map((v, i) => v ? v[1] : undefined)
  let data = {
    members: [
      getData('members', 0),
      getData('members', 1),
      getData('members', 2)
    ],
    messages: [
      getData('messages', 0),
      getData('messages', 1),
      getData('messages', 2)
    ],
    membersVoice: [
      getData('membersVoice', 0),
      getData('membersVoice', 1),
      getData('membersVoice', 2)
    ]
  }
  /*data = {
    messages: [
      [0,0,0,0,1,5,10,2,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,5,9,10,16,12,8,0,0,4,1,0,2,4,0,1,1],
      [0,0,0,0,1,5,10,2,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,5,9,10,16,12,8,0,0,4,1,0,2,4,0,1,1],
      [0,0,0,0,1,5,10,2,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,5,9,10,16,12,8,0,0,4,1,0,2,4,0,1,1]
    ],
    members: [
      [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11,11,11,11,11,11,11,11,11,11],
      [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11,11,11,11,11,11,11,11,11,11],
      [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11,11,11,11,11,11,11,11,11,11]
    ],
    membersVoice: [
      [0,0,0,0,0,0,2,4,4,4,4,5,5,5,8,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,6,5,5,2,2,0,0,0,0,1,2,2],
      [0,0,0,0,0,0,2,4,4,4,4,5,5,5,8,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,6,5,5,2,2,0,0,0,0,1,2,2],
      [0,0,0,0,0,0,2,4,4,4,4,5,5,5,8,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,6,5,5,2,2,0,0,0,0,1,2,2]
    ]
  }*/
  return visible
    ? <div className="stats">
      <StatsItem title="Members" state={data.members} color="rgb(47, 168, 118)" k="members" />
      <StatsItem title="Messages" state={data.messages} color="rgb(47, 140, 168)" k="messages" />
      <StatsItem title="Members in a voice channel" state={data.membersVoice} color="rgb(103, 47, 168)" k="membersVoice" />
    </div>
    : <></>
}, isEqual)