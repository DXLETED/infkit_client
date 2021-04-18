import { isEqual } from 'lodash'
import { useCookies } from 'react-cookie'
import { useDispatch, useSelector, useStore } from 'react-redux'
import socketIOClient from 'socket.io-client'
import { notify } from '../components/notify'
import { refreshToken } from './auth.hook'
import { useSettings } from './settings.hook'

let ws = null

const emit = (...args) => ws && ws.connected && ws.emit(...args)

export const update = {
  plugin: (plugin, changes, events) => emit('update/plugin', {plugin, changes, events}, res => res.status !== 200
    && notify.error({description: 'Save error', text: `Status: ${res.status}`})),
  settings: (changes, events) => emit('update/settings', {changes, events}, res => res.status !== 200
    && notify.error({description: 'Save error', text: `Status: ${res.status}`})),
  permissions: (changes, events) => emit('update/permissions', {changes, events}, res => res.status !== 200
    && notify.error({description: 'Save error', text: `Status: ${res.status}`})),
  groups: (changes, events) => emit('update/groups', {changes, events}, res => res.status !== 200
    && notify.error({description: 'Save error', text: `Status: ${res.status}`})),
  eventsOnly: (_, events) => emit('events', {events}, res => res.status !== 200
    && notify.error({description: 'Save error', text: `Status: ${res.status}`}))
}

export const useConnection = () => {
  const [cookie] = useCookies(['guild', 'token']),
        authorized = useSelector(s => s.authorized),
        autoReconnect = useSettings('autoReconnect', true),
        store = useStore(),
        dispatch = useDispatch()
  const setCn = n => dispatch({type: 'UPDATE_CNCT', data: n})
  const updateGuildState = data => {
    dispatch({type: 'SET_TIMESYNC', data: data.ts - Date.now()})
    dispatch({type: 'SAVE_GUILD', data})
    if (store.getState().guild && isEqual(store.getState().guild, data)) return
    dispatch({type: 'UPDATE_GUILD', data})
  }
  const reconnect = () => {
    notify.warn({text: 'Reconnecting'}, 5000)
    autoReconnect && connect()
  }
  const connect = ({tries = 0} = {}) => {
    const guild = cookie.guild
    if (!guild || !authorized || tries >= 3) return

    dispatch({type: 'CLEAR_GUILD'})
    ws && ws.disconnect()

    const auth = store.getState().auth
    const io = socketIOClient({path: '/socket/guilds', query: {token: auth.token, user_id: auth.userId}})
    ws = io
    
    io.emit('init', guild, async res => {
      if (res.status === 401) {
        await refreshToken()
        return connect(guild, authorized, {tries: tries + 1})
      }
      if (res.status === 200) {
        updateGuildState(res.d)
        setCn({active: true, sync: false, limited: false})
      } else notify.error({description: 'Connection error', text: `Status: ${res.status}`}, 10000)
      console.log(res.d)
    })
    io.on('update/all', res => {
      console.log('RESET')
      updateGuildState(res)
    })
    io.on('update/saving', () => setCn({sync: true}))
    io.on('update/plugin', res => {
      console.log('PLUGIN UPDATE', res)
      dispatch({type: 'guild/update/plugin', plugin: res.plugin, data: res.data})
      setCn({active: true, sync: false})
    })
    io.on('update/settings', res =>
      dispatch({type: 'guild/update/settings', data: res.data}))
    io.on('update/permissions', res =>
      dispatch({type: 'guild/update/permissions', data: res.data}))
    io.on('update/groups', res =>
      dispatch({type: 'guild/update/groups', data: res.data}))
    io.on('update/roles', res =>
      dispatch({type: 'guild/update/roles', data: res.data}))
    io.on('update/channels', res =>
      dispatch({type: 'guild/update/channels', data: res.data}))
    io.on('update/state', res => dispatch({type: 'guild/update/state', t: res.t, data: res.data}))
    io.on('update/server', res => {
      console.log('UPDATE SERVER', res)
      dispatch({type: 'SAVE_GUILD', data: {server: res}})
      dispatch({type: 'UPDATE_GUILD_SERVER', data: res})
    })
    io.on('update/stats', res => {
      if (!store.getState().guild) return
      dispatch({type: 'SAVE_GUILD', data: {stats: res}})
      dispatch({type: 'UPDATE_GUILD_STATS', data: res})
    })
    io.on('error', e => {
      setCn({active: false})
      console.log(e)
      reconnect()
    })
    io.on('disconnect', dtype => {
      setCn({active: false})
      console.log(dtype)
      dtype !== 'io client disconnect' && reconnect()
    })
  }
  const req = {
    member: id => ws && ws.connected && ws.emit('member', {id}, res => {
      console.log('MEMBER', res)
      if (res.status === 200)
        dispatch({type: 'guild/update/member', id: res.d.id, data: res.d})
      else if (res.status === 404)
        dispatch({type: 'guild/update/member', id: res.d.id, data: {avatar: null, name: '?????', discr: '----'}})
    }),
    members: ({p = 1, sort = 'xp', search = ''}) => ws && ws.connected && ws.emit('members', {lim: p * 50, sort, search}, res => {
      if (res.status === 200) {
        dispatch({type: 'guild/update/members', data: {loaded: res.loaded, list: res.d}})
      } else notify.error({description: 'Error loading members', text: `Status: ${res.status}`}, 10000)
    })
  }
  const disconnect = () => {
    ws && ws.connected && ws.disconnect()
    dispatch({type: 'CLEAR_GUILD'})
  }
  return { connect, update, req, disconnect, ws }
}