import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { DashboardContainer } from './Container'
import cn from 'classnames'
import moment from 'moment'
import { useConnection } from '../../hooks/connection.hook'
import { Row } from '../row'
import { Container } from '../container'
import { Scroll } from '../scroll'
import { Switch } from '../switch'
import { Fill } from '../fill'
import { Input } from '../input'
import { l } from '../../l'

import st from './Log.sass'

const LogMember = ({id, mr}) => {
  const m = useSelector(s => s.membersCache[id])
  const { req } = useConnection()
  useEffect(() => {
    id && req.member(id)
  }, [])
  return m
    ? <div className={cn(st.member, {[st.mr]: mr})}>
      <img className={st.avatar} src={m.avatar ? `https://cdn.discordapp.com/avatars/${id}/${m.avatar}.png?size=64` : 'https://discord.com/assets/322c936a8c8be1b803cd94861bdfa868.png'} />
      <div className={st.name}>{m.name}</div>
    </div>
    : <div>Loading</div>
}

const levels = {
  xp: ({user, p, c}) => <>
    <LogMember id={user} mr />
    <Container hp2 vp1 vcenter>
      <div className={st.prev}>{p}</div>
      <img className={st.arrow} src="/static/img/arrow/right.png" />
      <div className={st.current}>{c}</div>
    </Container>
  </>
}

const LogItem = ({s}) => <div className={st.logItem}>
  <div className={st.title}>
    <div className={st.l}>
      {s.by
        ? <LogMember id={s.by} />
        : <div>Server</div>}
      <div className={st.action}>
        {l(`log/t/${s.t}`, true) || s.t}
      </div>
    </div>
    <div className={st.ts}>
      <div className={st.date}>{moment(s.ts).format('D MMMM YYYY')}</div>
      <div className={st.time}>{moment(s.ts).format('HH:mm:ss')}</div>
    </div>
  </div>
  <div className={st.body}>
    {s.t === 'xp' && <levels.xp {...s} />}
  </div>
</div>

export const Log = ({path}) => {
  const state = useSelector(s => s.guild.log)
  const [filtersVisible, setFiltersVisible] = useState(false)
  const log = state//.sort((x, y) => y.ts - x.ts)
  return <DashboardContainer k="log" title="Log" className={st.log} icon="/static/img/log.png" deps={[state]} {...{path}}>
    <Row elements={[
      <Switch enabled={filtersVisible} set={() => setFiltersVisible(!filtersVisible)} fill p b>Filters</Switch>,
      <Switch enabled={filtersVisible} set={() => setFiltersVisible(!filtersVisible)} fill p b>Settings</Switch>,
      {width: 2, el: <Fill />},
      <Input className={st.search} placeholder="Search" input={n => setSearch(n)} fill b />
    ]} m />
    {filtersVisible && <></>}
    <Container>
      <Scroll column>
        {log.map(s => <LogItem s={s} />)}
      </Scroll>
    </Container>
  </DashboardContainer>
}