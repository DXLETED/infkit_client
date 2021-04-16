import { cloneDeep } from 'lodash'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { CSSTransition } from 'react-transition-group'
import { membersApi } from '../../api'
import { levelsMode } from '../../constants/levelsMode'
import { useConnection } from '../../hooks/connection.hook'
import { useSettings } from '../../hooks/settings.hook'
import { useGuild } from '../../hooks/useGuild'
import { useModal } from '../../hooks/useModal'
import { ms, msStr } from '../../utils/ms'
import { Container } from '../container'
import { EditableList } from '../editableList'
import { Fill } from '../fill'
import { Input } from '../input'
import { Loader } from '../Loader'
import { Modal } from '../modal'
import { Row } from '../row'
import { Select } from '../select'
import { DashboardContainer } from './Container'
import { Text } from '../Text'

import st from './Members.sass'
import { Scroll } from '../scroll'
import { Row2 } from '../Row2'
import { Svg } from '../svg'

const getLevel = xp => {
  const l = levelsMode.progressive.findIndex(l => l > xp)
  return l === -1 ? 100 : l - 1
}

const EXP = ({xp, mapi}) => {
  const [v, setV] = useState(xp)
  useEffect(() => { setV(xp) }, [xp])
  return <div className={st.exp}>
    <div className={st.xp}><Input value={xp} set={n => mapi.set.XP(n)} input={setV} type="number" min={0} max={1000000} fill /> XP</div>
    <div className={st.level}>Level {getLevel(xp)}{v !== xp && <><img src="/static/img/arrow/right.png" /><span className={st.curLevel}>{getLevel(v)}</span></>}</div>
  </div>
}

const Member = ({m, mapi, mXP, mMutes, mWarns, mBans, mm}) => {
  const [mState0, open0] = useModal({fullScreen: true}),
        [mState1, open1] = useModal({fullScreen: true}),
        [mState2, open2] = useModal({fullScreen: true})
  const mutes = mMutes.get(m.id),
        warns = mWarns.get(m.id),
        bans  = mBans.get(m.id)
  const isMuted = mutes.find(el => el.a),
        isBanned = bans.find(el => el.a)
  const list = (s, {time = false} = {}) => s.map(el => <div className={st.el}>
    <div className={st.completed}>{!el.a && <Svg k="done" />}</div>
    <div className={st.inner}>
      <div className={st.reason}>{el.reason || 'No reason'}</div>
      <div className={st.d}>
        <div className={st.by}>{mm.get(el.by).nickname || mm.get(el.by).username}</div>
        {time && <div className={st.time}>{msStr(el.time)}</div>}
      </div>
    </div>
  </div>)
  return <div className={st.member} style={{borderLeftColor: m.color !== '#000000' ? m.color : null}} key={m.id}>
    <img className={st.avatar} src={m.avatar ? `https://cdn.discordapp.com/avatars/${m.id}/${m.avatar}.png?size=64` : 'https://discord.com/assets/322c936a8c8be1b803cd94861bdfa868.png'} />
    <div className={st.ds}>
      <div className={st.nickname}>{m.nickname ? <>{m.nickname} <div className={st.username}>[ {m.username} ]</div></> : m.username}</div>
      <div className={st.discr}>#{m.discriminator}</div>
    </div>
    <div className={st.mutes} onClick={open0}>
      <img src="/static/img/mute.png" />
      {mMutes.get(m.id).length}
    </div>
    <div className={st.warns} onClick={open1}>
      <img src="/static/img/warn.png" />
      {mWarns.get(m.id).length}
    </div>
    <div className={st.bans} onClick={open2}>
      <img src="/static/img/ban.png" />
      {mBans.get(m.id).length}
    </div>
    <Modal s={mState0} className={st.modal} title={`${m.nickname || m.username} mutes`} footer={<div className={st.footer}>
      <div className={st.button}>{isMuted ? 'ADD MUTE' : 'MUTE'}</div>
      {isMuted && <div className={st.button}>UNMUTE</div>}
    </div>} column>
      {mutes.length ? list(mutes, {time: true}) : <Text jcc>No mutes</Text>}
    </Modal>
    <Modal s={mState1} className={st.modal} title={`${m.nickname || m.username} warnings`} footer={<div className={st.footer}>
        <div className={st.button} onClick={() => mapi.warn()}>WARN</div>
      </div>}>
      {warns.length ? list(warns) : <Text jcc>No warnings</Text>}
    </Modal>
    <Modal s={mState2} className={st.modal} title={`${m.nickname || m.username} bans`} footer={<div className={st.footer}>
        <div className={st.button}>{isBanned ? 'ADD BAN' : 'BAN'}</div>
        {isBanned && <div className={st.button}>UNBAN</div>}
      </div>
    }>
      {bans.length ? list(bans, {time: true}) : <Text jcc>No bans</Text>}
    </Modal>
    <EXP xp={mXP.get(m.id)} mapi={mapi} />
  </div>
}

export const Members = ({path}) => {
  let state = useSelector(s => s.guild.members.list)
  const api = useMemo(() => membersApi, []),
        {req} = useConnection(),
        [sort, setSort] = useSettings('membersSort', 'xp', {options: ['name', 'xp', 'position', 'mutes', 'warns', 'bans']}),
        [search, setSearch] = useState(''),
        loaded = useSelector(s => s.guild.members.loaded),
        location = useLocation(),
        [v, setV] = useState(location.pathname === `${path}/members`),
        mm = useGuild.membersCache(),
        mXP = useGuild.state.members.xp(),
        mMutes = useGuild.state.members.mutes(),
        mWarns = useGuild.state.members.warns(),
        mBans = useGuild.state.members.bans(),
        page = useRef(1),
        isDemo = useSelector(s => s.guild.demo)
  const load = async () => {
    console.log(page.current, loaded)
    await req.members({p: page.current + 1, sort, search})
    page.current ++
  }
  useEffect(() => { setV(location.pathname === `${path}/members`) }, [location])
  //useEffect(() => { (async () => { v && await req.members({p: 1, sort, search}) })() }, [v])
  useEffect(() => { (async () => { v && !loaded && await req.members({p: 1, sort, search}) })() }, [v, sort, search])
  state = state.sort((x, y) => x.name > y.name ? 1 : -1)
  switch (sort) {
    case 'xp':
      state = state.sort((x, y) => mXP.get(y.id) - mXP.get(x.id))
      break
    case 'position':
      state = state.sort((x, y) => y.pos - x.pos)
      break
    case 'mutes':
      state = state.sort((x, y) => mMutes.get(y.id).length - mMutes.get(x.id).length)
      break
    case 'warns':
      state = state.sort((x, y) => mWarns.get(y.id).length - mWarns.get(x.id).length)
      break
    case 'bans':
      state = state.sort((x, y) => mBans.get(y.id).length - mBans.get(x.id).length)
      break
  }
  if (search)
    state = state.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
  return <DashboardContainer k="members" title="Members" className={st.members} icon="/static/img/members.png" deps={[state]} {...{path}}>
    <Row2 className={st.head} els={[
      <Select type="options" prefix="Sort by: " selected={sort} dropdown={['Name', 'XP', 'Position', 'Mutes', 'Warns', 'Bans']} options={['name', 'xp', 'position', 'mutes', 'warns', 'bans']} set={setSort} />,
      [<Fill />, {flex: 2}],
      <Input className={st.search} placeholder="Search" input={n => setSearch(n)} fill b />
    ]} m />
    <Container>
      <Scroll>
        <Container className={st.membersList} style={{flexDirection: 'column'}}>
          {isDemo && <Container hp2 vp2 noflex>Not available in demo mode</Container>}
          {state.map((m, i) => <Member m={m} mapi={api.member(m.id)} {...{mXP, mMutes, mWarns, mBans, mm}} key={m.id + i} />)}
          <Loader loadedText={`${state.length} MEMBERS`} {...{load, loaded}} />
        </Container>
      </Scroll>
    </Container>
  </DashboardContainer>
}