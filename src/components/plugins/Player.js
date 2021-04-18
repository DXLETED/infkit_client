import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDelayedRequest } from '../../hooks/useDelayedRequest'
import { Input } from '../input'
import { Scroll } from '../scroll'
import { Select } from '../select'
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'
momentDurationFormatSetup(moment)
import { Switch } from '../switch'
import cn from 'classnames'

import st from './Player.sass'
import { useSelector } from 'react-redux'
import { Slider } from '../slider'
import { throttle } from '../../utils/throttle'
import { debounce } from 'lodash'

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
  const durationFormatted = state.duration * 1000
  const position = playing ? state.resumed ? (state.pos + (state.time - state.posUpdate)) : state.pos : 0
  return <>
    <div className={st.timelineInner}>
      <div className={st.pl} />
      <div className={st.progress} style={{width: `${position / durationFormatted * 100}%`}}></div>
    </div>
    <div className={st.status}>
      <div className={st.position}>{position <= durationFormatted
        ? playing && position > 1000 ? moment.duration(Math.floor(position / 1000), 'seconds').format() : '0:00'
        : moment.duration(Math.floor(durationFormatted / 1000), 'seconds').format()}</div>
      <div className={st.duration}>{!!state.duration && moment.duration(Math.floor(state.duration), 'seconds').format()}</div>
    </div>
  </>
}

export const Player = ({state, api}) => {
  const mstate = useSelector(s => s.guild.state.music)
  const [searchResults, setResults] = useState([])
  const inputVal = useRef()
  const clearInput = useRef(0)
  const [search, cancelSearch] = useDelayedRequest((input, data) => input.params.query === inputVal.current && setResults(data), 2000)
  const controls = useMemo(() => ({
    playpause: throttle(api.playpause, 500, {trailing: false}),
    volume: {
      add: throttle(api.volume.add, 200, {trailing: false}),
      sub: throttle(api.volume.sub, 200, {trailing: false})
    }
  }), [])
  const keyup = useMemo(() => e => {
    if (e.target.tagName.toUpperCase() === 'INPUT') return
    if (e.keyCode === 32) {
      controls.playpause()
      e.preventDefault()
    }
    if (e.keyCode === 38) {
      controls.volume.add()
      e.preventDefault()
    }
    if (e.keyCode === 40) {
      controls.volume.sub()
      e.preventDefault()
    }
  })
  useEffect(() => {
    document.addEventListener('keydown', keyup)
    return () => document.removeEventListener('keydown', keyup)
  }, [])
  return <div className={cn(st.player, {[st.bg]: !!mstate.np?.thumbnail})}>
    <div className={st.image} style={{backgroundImage: `url(${mstate.np?.thumbnail})`}} />
    <div className={st.controls}>
      <Select type="voice" selected={mstate.channel} add={[{id: null, name: 'OFF'}]} set={api.setChannel} m />
      <div className={st.info}>
        <div className={st.thumbnail}>{mstate.playing && mstate.np && <img src={mstate.np.thumbnail} />}</div>
        <div className={st.d}>
          {mstate.playing && mstate.np ? <>
            <div className={st.title}>{mstate.np.title}</div>
            <div className={st.author}>{mstate.np.author}</div>
            <div className={st.views}>{mstate.np.views} views</div>
            <div className={st.duration}>{moment.duration(Math.floor(mstate.np.duration), 'seconds').format()}</div>
          </> : <div className={st.nothing}>Nothing is playing right now</div>}
        </div>
      </div>
      <div className={st.timeline}>
        <Timeline playing={mstate.playing} resumed={mstate.resumed} pos={mstate.pos} posUpdate={mstate.posUpdate} duration={mstate.playing && mstate.np?.duration} />
      </div>
      <div className={st.buttons}>
        <div className={st.volume}>
          <div className={st.icon}>
            <img src="/static/img/music-control/volume.png" />
          </div>
          <Slider label="Volume" value={state.volume} keyPoints={20} set={api.volume.set} min={0.1} compact flex />
          <div className={st.state}>{parseFloat((state.volume * 100).toFixed(2))}%</div>
        </div>
        <div className={cn(st.btn, {disabled: true || !mstate.prev})} onClick={api.prev}><img src="/static/img/music-control/prev.png" /><div className={st.border} /></div>
        <div className={st.btn} onClick={api.playpause}>{(!mstate.playing || !mstate.resumed) ? <img src="/static/img/music-control/play.png" /> : <img src="/static/img/music-control/pause.png" />}<div className={st.border} /></div>
        <div className={st.btn} onClick={api.skip}><img src="/static/img/music-control/next.png" /><div className={st.border} /></div>
      </div>
    </div>
    <div className={st.queue}>
      <Input placeholder="Search" ddset={n => {
        api.play(searchResults[n].link)
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
      <div className={st.list}>
        <Scroll deps={[mstate.queue]} column pl>
          {!mstate.np && !mstate.queue.length && <div className={st.noitems}>The queue is empty</div>}
          {mstate.prev && <div className={st.el}>
            <div className={st.d}>
              <div className={st.icon}><img src="/static/img/music-control/prev.png" /></div>
              <a className={st.title}>{mstate.prev.title}</a>
              <div className={st.duration}>{moment.duration(Math.floor(mstate.prev.duration), 'seconds').format()}</div>
            </div>
          </div>}
          {mstate.np && <div className={cn(st.el, st.np)}>
            <div className={st.d}>
              <div className={st.icon}><img src="/static/img/music-control/play.png" /></div>
              <a className={st.title}>{mstate.np.title}</a>
              <div className={st.duration}>{moment.duration(Math.floor(mstate.np.duration), 'seconds').format()}</div>
            </div>
          </div>}
          {mstate.queue.map((el, i) => <div className={st.el} key={i}>
            <div className={st.d}>
              <div className={st.icon}>{i === 0 && <img src="/static/img/music-control/next.png" />}</div>
              <a className={st.title}>{el.title}</a>
              <div className={st.duration}>{moment.duration(Math.floor(el.duration), 'seconds').format()}</div>
            </div>
            <div className={st.ctrl}>
              {/*<div className={st.up}><img src="/static/img/arrow/top.png" /></div>
              <div className={st.down}><img src="/static/img/arrow/bottom.png" /></div>*/}
              <div onClick={() => api.queue.del(i)}><img src="/static/img/delete.png" /></div>
            </div>
          </div>)}
        </Scroll>
      </div>
      <Switch className={st.repeat} enabled={state.repeat} set={api.repeat} p><img src="/static/img/music-control/repeat.png" />Repeat</Switch>
    </div>
    {/*<Select type="voice" selected={mstate.channel} add={[{id: null, name: 'OFF'}]} set={api.setChannel} m />
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
      <div className={st.thumbnail}>{mstate.playing && mstate.np && <img src={mstate.np.thumbnail} />}</div>
      <div className={st.d}>
        {mstate.playing && mstate.np ? <>
          <div className={st.title}>{mstate.np.title}</div>
          <div className={st.author}>{mstate.np.author}</div>
          <div className={st.views}>{mstate.np.views} views</div>
        </> : <div className={st.nothing}>Nothing is playing right now</div>}
      </div>
    </div>
    <div className={st.controlPanel}>
      <Row elements={[
        {className: st.timeline, el: <Timeline playing={mstate.playing} resumed={mstate.resumed} pos={mstate.pos} posUpdate={mstate.posUpdate} duration={mstate.playing && mstate.np?.duration} />},
        {width: 0, el: <Switch className={st.repeat} enabled={state.repeat} set={api.repeat} flex p><img src="/static/img/music-control/repeat.png" />Repeat</Switch>}
      ]} m />
      <div className={st.control1}>
        <div className="prev"><img src="/static/img/music-control/prev.png" /><div className={st.border} /></div>
        <div className="pause" onClick={api.playpause}>{(!mstate.playing || !mstate.resumed) ? <img src="/static/img/music-control/play.png" /> : <img src="/static/img/music-control/pause.png" />}<div className={st.border} /></div>
        <div className="next" onClick={api.skip}><img src="/static/img/music-control/next.png" /><div className={st.border} /></div>
      </div>
    </div>
    <Slider label="Volume" value={state.volume} keyPoints={20} set={api.volume} min={0.1} custom m />
    <div className={st.queue}>
      <Scroll>
        <div className={st.queueInner}>
          <EditableList label="Queue" data={[mstate.playing && {...mstate.np, np: true}, ...mstate.queue].filter(Boolean).map((m, i) => ({fixed: m.np, el: <Container hp2 vp2 spaceBetween key={m.url + i}>
            <div className={st.title}>{m.title}</div>
            <div className={st.duration}>{m.duration}</div>
          </Container>}))} delete={api.queue.del} empty={<Container hp2 vp2 spaceBetween>The queue is empty</Container>} noAdd />
        </div>
      </Scroll>
    </div>
    <CustomTime label="Leave after" value={0} max={600000} defsize b />*/}
  </div>
}