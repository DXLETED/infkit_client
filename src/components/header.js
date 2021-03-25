import React, { memo } from 'react'
import { useHistory, useLocation } from 'react-router'
import { NavLink } from 'react-router-dom'
import cookies from 'react-cookies'
import { useDispatch, useSelector } from 'react-redux'
import { useCookies } from 'react-cookie'
import { Dropdown } from '../components/dropdown'
import { useAuth } from '../hooks/auth.hook'
import cn from 'classnames'

import st from './Header.sass'
import { Fragment } from 'react'
import { useLayout } from '../hooks/layout.hook'

const HeaderEl = props => {
  let history = useHistory()
  const click = e => {
    if (props.to && props.to.includes('://'))
      return window.location = props.to
    props.to && history.push(props.to)
    props.onClick && props.onClick(e)
  }
  return (
    <div className="header-el" onClick={click}>{props.children}</div>
  )
}

export const Header = memo(() => {
  const location = useLocation()
  const guilds = useSelector(s => s.guilds)
  const dispatch = useDispatch()
  const [cookie, setCookie, removeCookie] = useCookies(['guild', 'account'])
  const layout = useLayout()
  const { isAuthenticated, user } = useAuth()
  const login = () => {
    window.open(
      `https://discord.com/api/oauth2/authorize?client_id=${SERVER_CONFIG.clientId}&redirect_uri=${SERVER_CONFIG.url}login&response_type=code&scope=identify%20email%20guilds`,
      'InfKit - Login',
      `width=500,height=800,top=${window.top.outerHeight / 2 + window.top.screenY - (800 / 2)},left=${window.top.outerWidth / 2 + window.top.screenX - (500 / 2)}`)
  }
  return (
    <div id="header">
      <header>
        <div className="left-list">
          <NavLink exact to="/" className="header-el main"><img src="/static/img/logo.png" />{location.pathname !== '/' && !layout.ap4 && 'INFINITY KIT'}</NavLink>
          {cookie.guild
            ? <>
              <NavLink to="/dashboard" className="header-el">DASHBOARD</NavLink>
            </>
            : <>
              <NavLink to="/demo" className="header-el">DEMO</NavLink>
            </>
          }
        </div>
        <div className="right-list">
          {location.pathname !== '/' && guilds && cookie.guild && guilds.find(g => g.id === cookie.guild) && (() => {
            let g = guilds.find(g => g.id === cookie.guild)
            return <Dropdown className="header-el guild" dropdown={guilds.filter(g => g.bot).map((g, i) => <div className={st.guildEl} onClick={() => {
                g.bot && setCookie('guild', g.id, {path: '/'})
              }} key={i}>
                {g.icon ? <img src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}`} className={cn(st.icon, 'icon')} /> : <div className={cn(st.icon, 'icon')}>{g.name.split(' ').length <= 1 ? g.name.split(' ')[0][0] : g.name.split(' ')[0][0] + g.name.split(' ')[1][0]}</div>}
                <div className={st.info}>{g.name}<div className={cn(st.id, 'user-select')} onClick={e => e.stopPropagation()}>{g.id}</div></div>
              </div>)}>
              {g.icon ? <div className="icon"><img src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}`} /></div> : <div className="icon">{g.name.split(' ').length <= 1 ? g.name.split(' ')[0][0] : g.name.split(' ')[0][0] + g.name.split(' ')[1][0]}</div>}
              {layout.ap4 ? '' : g.name}
            </Dropdown>
          })()}
          {isAuthenticated && user
            ? <Dropdown className="header-el discord-user" dropdown={[<div className={st.logout} onClick={() => {
                dispatch({type: 'UPDATE_AUTH', data: {}})
                dispatch({type: 'UPDATE_USER', data: {}})
                dispatch({type: 'UPDATE_AUTHORIZED', data: false})
              }}><img src="/static/img/logout.png" className={st.icon} />LogOut</div>]}>
              {<div className="icon">{user.avatar && <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} />}</div>}
              {layout.ap3 ? '' : user.username}
            </Dropdown>
            : <HeaderEl onClick={() => login()}>LOG IN</HeaderEl>}
          <HeaderEl activeClassName={false} className="header-el">EN</HeaderEl>
        </div>
      </header>
    </div>
  )
})