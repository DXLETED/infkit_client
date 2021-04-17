import './css-legacy/styles'
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
import { useAuth } from './hooks/auth.hook'

import st from './pages/Main.sass'
import { colors } from './components/colorlist'

const supportsWebp = async () => {
  if (!self.createImageBitmap) return false
  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA='
  const blob = await fetch(webpData).then(r => r.blob())
  return createImageBitmap(blob).then(() => true, () => false)
}
let webp

const Main = () => {
  const dispatch = useDispatch()
  const [cookie] = useCookies(['guild', 'token'])
  const [animeBg] = useSettings('anime')
  const auth = useSelector(s => s.auth)
  const [cookiesAccepted, cookiesAccept] = useSettings('cookiesAccepted', false)
  const { getUser } = useAuth()
  useEffect(() => {
    if (cookie.account)
      Axios.get('/api/v1/guilds')
        .then(res => dispatch({type: 'UPDATE_GUILDS', data: Object.values(res.data).sort(g => g.bot ? -1 : 1)}))
  }, [cookie.account])
  useEffect(() => {
    if (!cookiesAccepted)
      setTimeout(() => notify.question({
        text: 'InfinityKit uses cookies, by continuing to browse the site you are agreeing to our use of cookies',
        options: [['ACCEPT', () => cookiesAccept(true)]]
      }), 5000)
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
  const bg = animeBg
    ? `linear-gradient(to bottom, ${colors.main} 0%, transparent 100%), center center / cover url(/static/img/anime-bg.png), #000`
    : `linear-gradient(to bottom, ${colors.main} 0%, transparent 100%), bottom 20% center / cover url(/static/img/bg.${webp ? 'webp' : 'png'})`
  return (
    <>
      <Router>
        <div className={st.mainBg}>
          <div className={st.imageLeft} style={{ background: bg }} />
          <div className={st.image} style={{ background: bg }} />
          <div className={st.imageRight} style={{ background: bg }} />
        </div>
        <page>
          <Header />
          <Route exact path="/" component={MainPage} />
          <Route path="/dashboard"><Dashboard path="/dashboard" /></Route>
          <Route path="/demo"><Demo /></Route>
          <Route path="/login" component={Login} />
        </page>
      </Router>
      <Notifications />
    </>
  )
}

(async () => {
  webp = await supportsWebp()
  ReactDOM.render(<Provider store={store}><Main /></Provider>, document.getElementsByTagName('root')[0])
})()