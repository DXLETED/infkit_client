import { useCookies } from 'react-cookie'
import { useDispatch, useSelector, useStore } from 'react-redux'
import socketIOClient from 'socket.io-client'
import { notify } from '../components/notify'
import { refreshToken } from './auth.hook'
import { useSettings } from './settings.hook'

let ws = null

export const emit = {
  update: {
    guild: ({changes, events} = {}) => ws && new Promise(res => ws.emit('update/guild', {changes, events}, res))
  }
}

export const useConnection = () => {
  const [cookie] = useCookies(['guild', 'token']),
        authorized = useSelector(s => s.authorized),
        autoReconnect = useSettings('autoReconnect', true),
        store = useStore(),
        dispatch = useDispatch()
  const setCn = n => dispatch({type: 'UPDATE_CNCT', data: n})
  const updateGuildState = data => {
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
      res.status === 200 && updateGuildState(res.d)
      setCn({active: true, sync: false, limited: false})
      console.log(res.d)
    })
    io.on('update/all', res => res.status === 200 && updateGuildState(res.d))
    io.on('update/saving', () => setCn({sync: true}))
    io.on('update/ustgs', res => {
      console.log('GUILD UPDATE', res)
      dispatch({type: 'SAVE_GUILD', data: res})
      dispatch({type: 'UPDATE_GUILD', data: res})
      setCn({active: true, sync: false})
    })
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
    io.on('error', () => {
      setCn({active: false})
      reconnect()
    })
    io.on('disconnect', dtype => {
      setCn({active: false})
      dtype !== 'io client disconnect' && reconnect()
    })
  }
  const req = {
    member: id => ws && ws.connected && ws.emit('member', {id}, res => {
      if (res.status === 200)
        dispatch({type: 'UPDATE_MEMBERS_CACHE', data: {[id]: res.d}})
      else if (res.status === 404)
        dispatch({type: 'UPDATE_MEMBERS_CACHE', data: {[id]: {avatar: null, name: '?????', discr: '----'}}})
    }),
    members: ({p = 1, sort = 'xp', search = ''}) => ws && ws.connected && ws.emit('members', {lim: p * 50, sort, search}, res => {
      if (res.status === 200) {
        dispatch({type: 'SET_MEMBERS', data: res.d})
        dispatch({type: 'SET_MEMBERS_LOADED', data: res.loaded})
      } else notify.error({description: 'Error loading members', text: `Status: ${res.status}`}, 10000)
    })
  }
  const disconnect = () => {
    ws && ws.connected && ws.disconnect()
    dispatch({type: 'CLEAR_GUILD'})
  }
  return { connect, req, disconnect, ws }
}