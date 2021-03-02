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
import { Switch } from 'react-router'
import { convertYTTime } from '../../utils/convertYTTime'

import st from './Player.sass'

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
    <div className={st.timeline}>
      <div className={st.progress} style={{width: `${position / durationFormatted * 100}%`}}></div>
    </div>
  </>
}

export const Player = ({state, api}) => {
  const [searchResults, setResults] = useState([])
  const inputVal = useRef()
  const clearInput = useRef(0)
  const [search, cancelSearch] = useDelayedRequest((input, data) => input.params.query === inputVal.current && setResults(data), 2000)
  return <>
    <Select type="voice" selected={state.channel} add={[{id: null, name: 'OFF'}]} set={api.setChannel} m />
    <Input placeholder="Search" ddset={n => {
      api.play(searchResults[n].id)
      setResults([])
      clearInput.current ++
      }} dropdown={searchResults ? searchResults.map(r => <>
      <img className="input__dropdown__item__thumbnail" src={r.thumbnail} />
      <div className="input__dropdown__item__d">
        <div className="input__dropdown__item__d__title">{r.title}</div>
        <div className="input__dropdown__item__d__desc">{r.type.slice(0, 1).toUpperCase()}{r.type.slice(1)} | {r.duration} | {r.views} views</div>
      </div>
    </>) : []} input={n => {
      inputVal.current = n
      setResults([])
      search({url: '/api/v1/youtube/videos', params: {query: n}})
    }} dropdownVisible={searchResults.length} clear={clearInput.current} defsize p m b />
    <div className="np">
      <div className="thumbnail">{state.playing && state.queue[0] && <img src={state.queue[0].thumbnail} />}</div>
      <div className="np-d">
        {state.playing && state.queue[0] ? <>
          <div className="np-title">{state.queue[0].title}</div>
          <div className="np-author">{state.queue[0].author}</div>
          <div className="np-views">{state.queue[0].views} views</div>
        </> : <div className="np-nothing">Nothing is playing right now</div>}
      </div>
    </div>
    <div className="control-panel">
      <div className="control-1">
        <div className="prev"><img src="/static/img/music-control/prev.png" /><div className="border" /></div>
        <div className="pause" onClick={api.playpause}>{!state.resumed ? <img src="/static/img/music-control/play.png" /> : <img src="/static/img/music-control/pause.png" />}<div className="border" /></div>
        <div className="next" onClick={api.skip}><img src="/static/img/music-control/next.png" /><div className="border" /></div>
      </div>
      <Row elements={[
        {className: st.timelineWr, el: <Timeline playing={state.playing} resumed={state.resumed} pos={state.pos} posUpdate={state.posUpdate} duration={state.playing && state.queue[0] && state.queue[0].duration} />},
        {width: 0, el: <Switch className="repeat" enabled={state.repeat} set={api.repeat} p flex><img src="/static/img/music-control/repeat.png" />Repeat</Switch>}
      ]} />
    </div>
    <Slider label="Volume" value={state.volume} keyPoints={20} set={api.volume} min={0.1} custom m />
    <div className="queue-wr">
      <Scroll>
        <div className="queue">
          <EditableList label="Queue" data={state.queue.map((m, i) => ({fixed: i === 0, el: <Container hp2 vp2 spaceBetween>
            <div className="q-title">{m.title}</div>
            <div className="q-duration">{m.duration}</div>
          </Container>}))} delete={api.queue.del} empty={<Container hp2 vp2 spaceBetween>The queue is empty</Container>} noAdd />
        </div>
      </Scroll>
    </div>
  </>
}