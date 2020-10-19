import './css/styles'
import React, { useEffect, useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import { Header } from './components/header'
import { BrowserRouter as Router, Route, Switch as RouterSwitch } from 'react-router-dom'
import { Provider, useSelector, useDispatch, useStore } from 'react-redux'
import Axios from 'axios'
import { Dashboard } from './pages/dashboard'
import { useCookies } from 'react-cookie'
import { Demo } from './pages/demo'
import { store } from './store'
import { Notifications } from './components/notifications'
import { MainPage } from './pages/main'
import socketIOClient from 'socket.io-client'
import { notify } from './components/notify'
import { isEqual } from 'lodash'
import { useSettings } from './hooks/settings.hook'
import { Login } from './pages/login'
import { refreshToken, useAuth } from './hooks/auth.hook'
import { Modals } from './components/modals'

const Main = () => {
  const dispatch = useDispatch()
  const [cookie] = useCookies(['guild', 'token'])
  const auth = useSelector(s => s.auth)
  const authorized = useSelector(s => s.authorized)
  const store = useStore()
  const setCn = n => dispatch({type: 'UPDATE_CNCT', data: n})
  const [cookiesAccepted, cookiesAccept] = useSettings('cookiesAccepted', false)
  const { getUser } = useAuth()
  useEffect(() => {
    if (cookie.account)
      Axios.get('/api/v1/guilds')
        .then(res => dispatch({type: 'UPDATE_GUILDS', data: Object.values(res.data).sort(g => g.bot ? -1 : 1)}))
  }, [cookie.account])
  let ws = useRef()
  const updateGuildState = data => {
    dispatch({type: 'SAVE_GUILD', data})
    if (store.getState().guild && isEqual(store.getState().guild, data)) return
    dispatch({type: 'UPDATE_GUILD', data})
  }
  const connect = ({tries = 0} = {}) => {
    if (!cookie.guild || !authorized || tries >= 3) return
    ws.current && ws.current.disconnect()
    const io = socketIOClient({path: '/socket/guilds', query: {token: auth.token, user_id: auth.userId}})
    ws.current = io
    io.emit('init', cookie.guild, async res => {
      if (res.status === 401) {
        await refreshToken()
        return connect({tries: tries + 1})
      }
      console.log(res)
      res.status === 200 && updateGuildState(res.d)
      setCn({active: true, sync: false, limited: false})
    })
    io.on('update/all', res => res.status === 200 && updateGuildState(res.d))
    io.on('update/saving', () => setCn({sync: true}))
    io.on('update/ustgs', res => {
      console.log(res)
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
      dispatch({type: 'SAVE_GUILD', data: {stats: res}})
      dispatch({type: 'UPDATE_GUILD_STATS', data: res})
    })
    io.on('error', () => {
      notify.warn({text: 'Reconnecting'}, 5000)
      setCn({active: false})
      connect()
    })
  }
  useEffect(() => {
    connect()
  }, [cookie.guild, authorized])
  useEffect(() => {
    if (!cookiesAccepted)
      setTimeout(() => notify.question({
        text: 'InfinityKit uses cookies, by continuing to browse the site you are agreeing to our use of cookies',
        options: [['ACCEPT', () => cookiesAccept(true)]]
      }), 5000)
    console.log(cookie)
    if (auth.userId && auth.token)
      getUser()
    window.addEventListener('storage', e => {
      if (e.key === 'authorized' && e.newValue === 'true') {
        dispatch({type: 'UPDATE_AUTHORIZED', data: true})
        localStorage.removeItem('authorized')
        getUser()
      }
    })
  }, [])
  return (
    <>
      <Router>
        <div className="main-bg" />
        <Header />
        <Route exact path="/" component={MainPage} />
        <Route path="/dashboard"><Dashboard path="/dashboard" /></Route>
        <Route path="/demo"><Demo /></Route>
        <Route path="/login" component={Login} />
      </Router>
      <Notifications />
    </>
  )
}

ReactDOM.render(<Provider store={store}><Main /></Provider>, document.getElementsByTagName('root')[0])