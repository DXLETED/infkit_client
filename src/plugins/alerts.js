import React, { Fragment, memo, useEffect } from 'react'
import { EditableList } from '../components/editableList'
import { Select } from '../components/select'
import { TextArea } from '../components/textarea'
import { Input } from '../components/input'
import { useDelayedRequest } from '../hooks/useDelayedRequest'
import { isEqual } from 'lodash'
import { Icon } from '../components/icon'
import { useState } from 'react'
import { useRef } from 'react'
import Axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { notify } from '../components/notify'
import { User } from '../components/user'
import { Category } from '../components/Category'

const MsgTips = ({ tips, add }) => tips.map(([text, description], i) => <div className="tip" onClick={() => add(`[${text}]`)} key={i}>[{text}]<span className="tip__description">&nbsp;- {description}</span></div>)

const Alert = memo(({d, api, i}) => {
  const [searchResults, setResults] = useState([])
  const twitchChannel = useSelector(s => s.channels.twitch[d.sub])
  const inputVal = useRef()
  const inputAdd = useRef()
  const [search, cancelSearch] = useDelayedRequest((input, data) => input.params.query === inputVal.current && setResults(data), 400)
  const dispatch = useDispatch()
  useEffect(() => {
    (async () => {
      if (!d.sub) return
      try {
        const r = await Axios.get('/api/v1/twitch/channel', {params: {q: d.sub}})
        dispatch({type: 'SET_CHANNEL_TWITCH', id: d.sub, data: r.data})
      } catch (e) {
        notify.warn({text: 'Failed to load channel name'})
      }
    })()
  }, [d.sub])
  return <Fragment key={d.id}>
    {/*!d.sub && <Select type="options" selected={d.platform} options={['twitch']} dropdown={['Twitch']} set={n => api.setPlatform(i, n)} m />*/}
    {d.sub
      ? <User img={twitchChannel ? twitchChannel.profile_image_url : '/static/img/loading.gif'} name={twitchChannel && twitchChannel.display_name} bg={!!twitchChannel} m />
      : <Input placeholder="Search" ddset={n => api.setSub(i, searchResults[n].id)} dropdown={searchResults ? searchResults.map(r => <>
          <Icon src={r.thumbnail_url} alt={r.display_name} />
          <div className="name">{r.display_name}</div>
        </>) : []} input={n => {
          inputVal.current = n
          setResults([])
          search({url: '/api/v1/twitch-channels', params: {query: n}})
        }} dropdownVisible={true} defsize p m b />}
    <Select type="text" selected={d.channelId} set={n => api.setChannelId(i, n)} add={[{id: null, name: 'Select channel'}]} m />
    <TextArea value={d.msg.content} placeholder="Message" set={n => api.setMsgContent(i, n)} emoji />
    <div className="msg-tips">
      <MsgTips tips={[
        ['name', 'Streamer name'],
        ['link', 'Link to stream']
      ]} add={n => api.setMsgContent(i, d.msg.content.concat(n))} />
    </div>
  </Fragment>
}, isEqual)

export const Alerts = ({ state, api }) => <>
  <Category>
    <EditableList data={state.d.map((al, i) => <Alert d={al} api={api} i={i} key={al.id} />)}
      label="Subscribes"
      addLabel="Subscribe to notifications"
      add={api.add}
      delete={api.del} extended column p={1} limit={5} />
  </Category>
</>