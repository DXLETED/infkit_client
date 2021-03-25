import React, { useEffect, useRef, useState } from 'react'
import { useDelayedRequest } from '../../hooks/useDelayedRequest'
import { Container } from '../container'
import { EditableList } from '../editableList'
import { Input } from '../input'
import { Row } from '../row'
import { Scroll } from '../scroll'
import { Select } from '../select'
import { Slider } from '../slider'
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'
momentDurationFormatSetup(moment)
import { Switch } from '../switch'
import { convertYTTime } from '../../utils/convertYTTime'

import st from './Player.sass'
import { CustomTime } from '../customTime'

const Timeline = ({playing, resumed, pos, posUpdate, duration}) => {
  const [state, setState] = useState({resumed: 0, pos: 0, posUpdate: 0, duration: 0, time: Date.now()})
  useEffect(() => {
    setState({resumed, pos, posUpdate, duration, time: Date.now()})
    if (playing && resumed && posUpdate && duration) {
      const interval = setInterval(() => {
        setState(s => ({...s, time: Date.now()}))
      }, 1000 / 10)
      return () => clearInterval(interval)
    }
  }, [posUpdate])
  const durationFormatted = convertYTTime(state.duration) * 1000
  const position = playing ? state.resumed ? (state.pos + (state.time - state.posUpdate)) : state.pos : 0
  return <>
      <div className={st.status}>
      <div className={st.position}>{position <= durationFormatted
        ? playing && position > 1000 ? moment.duration(Math.floor(position / 1000), 'seconds').format() : '0:00'
        : moment.duration(Math.floor(durationFormatted / 1000), 'seconds').format()}</div>
      <div className={st.duration}>{state.duration}</div>
    </div>
    <div className={st.timelineInner}>
      <div className={st.progress} style={{width: `${position / durationFormatted * 100}%`}}></div>
    </div>
  </>
}

export const Player = ({state, api}) => {
  const [searchResults, setResults] = useState([])
  const inputVal = useRef()
  const clearInput = useRef(0)
  const [search, cancelSearch] = useDelayedRequest((input, data) => input.params.query === inputVal.current && setResults(data), 2000)
  const keyup = e => {
    if (e.target.tagName.toUpperCase() === 'INPUT') return
    if (e.keyCode === 32) {
      api.playpause()
      e.preventDefault()
    }
  }
  useEffect(() => {
    document.addEventListener('keydown', keyup)
    return () => document.removeEventListener('keydown', keyup)
  })
  return <>
    <Select type="voice" selected={state.channel} add={[{id: null, name: 'OFF'}]} set={api.setChannel} m />
    <Input placeholder="Search" ddset={n => {
      api.play(searchResults[n].id)
      setResults([])
      clearInput.current ++
      }} dropdown={searchResults ? searchResults.map(r => <div className={st.searchRes}>
        <img className={st.thumbnail} src={r.thumbnail} />
        <div className={st.d}>
          <div className={st.title}>{r.title}</div>
          <div className={st.desc}>{r.type.slice(0, 1).toUpperCase()}{r.type.slice(1)} | {r.duration} | {r.views} views</div>
        </div>
    </div>) : []} input={n => {
      inputVal.current = n
      setResults([])
      search({url: '/api/v1/youtube/videos', params: {query: n}})
    }} dropdownVisible={searchResults.length} clear={clearInput.current} defsize p m b />
    <div className={st.np}>
      <div className={st.thumbnail}>{state.playing && state.np && <img src={state.np.thumbnail} />}</div>
      <div className={st.d}>
        {state.playing && state.np ? <>
          <div className={st.title}>{state.np.title}</div>
          <div className={st.author}>{state.np.author}</div>
          <div className={st.views}>{state.np.views} views</div>
        </> : <div className={st.nothing}>Nothing is playing right now</div>}
      </div>
    </div>
    <div className={st.controlPanel}>
      <Row elements={[
        {className: st.timeline, el: <Timeline playing={state.playing} resumed={state.resumed} pos={state.pos} posUpdate={state.posUpdate} duration={state.playing && state.np?.duration} />},
        {width: 0, el: <Switch className={st.repeat} enabled={state.repeat} set={api.repeat} flex p><img src="/static/img/music-control/repeat.png" />Repeat</Switch>}
      ]} m />
      <div className={st.control1}>
        <div className="prev"><img src="/static/img/music-control/prev.png" /><div className={st.border} /></div>
        <div className="pause" onClick={api.playpause}>{(!state.playing || !state.resumed) ? <img src="/static/img/music-control/play.png" /> : <img src="/static/img/music-control/pause.png" />}<div className={st.border} /></div>
        <div className="next" onClick={api.skip}><img src="/static/img/music-control/next.png" /><div className={st.border} /></div>
      </div>
    </div>
    <Slider label="Volume" value={state.volume} keyPoints={20} set={api.volume} min={0.1} custom m />
    <div className={st.queue}>
      <Scroll>
        <div className={st.queueInner}>
          <EditableList label="Queue" data={[state.playing && {...state.np, np: true}, ...state.queue].filter(Boolean).map((m, i) => ({fixed: m.np, el: <Container hp2 vp2 spaceBetween key={m.url + i}>
            <div className={st.title}>{m.title}</div>
            <div className={st.duration}>{m.duration}</div>
          </Container>}))} delete={api.queue.del} empty={<Container hp2 vp2 spaceBetween>The queue is empty</Container>} noAdd />
        </div>
      </Scroll>
    </div>
    <CustomTime label="Leave after" value={0} max={600000} defsize b />
  </>
}