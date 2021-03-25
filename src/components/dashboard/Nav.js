import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import { l } from '../../l'
import st from './Nav.sass'
import cn from 'classnames'
import { colors } from '../colorlist'
import { useSelector } from 'react-redux'
import { useCookies } from 'react-cookie'
import { pluginApi } from '../../api'
import { useLayout } from '../../hooks/layout.hook'

const NavEl = ({text, img, src, color, to, history, active, enabled, toggleEnabled, textVisible, m, ml, wa, onClick}) => {
  const [width, setWidth] = useState(null)
  const [hover, setHover] = useState(false)
  const ref = useRef()
  const onMouseEnter = () => setHover(true)
  const onMouseLeave = () => setHover(false)
  const layout = useLayout({p1540: 1540})
  useEffect(() => {
    !textVisible && setWidth(
      + (enabled !== undefined && active ? 90 : 50)
      + (layout.p1540 ? 0 : 20)
      + (layout.ap3 ? -10 : +(window.getComputedStyle(ref.current).getPropertyValue('width').replace('px', ''))))
  }, [textVisible, hover, active, layout])
  return <div className={cn(st.el, {[st.active]: active, [st.textVisible]: textVisible, [st.m]: m, [st.ml]: ml, [st.wa]: wa})} style={{width: (active || hover) && width}} onClick={() => {
    to && history?.push(to)
    onClick?.()
  }} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    <div className={st.inner}>
      {img}
      {src && <img src={src} />}
      <span ref={ref}>{text}</span>
    </div>
    <div className={st.color} style={{background: color}} />
    {active && enabled !== undefined
      && <div className={st.enabled} onClick={toggleEnabled}>{enabled ? <img src="/static/img/on.png" /> : <img src="/static/img/off.png" />}</div>}
  </div>
}

export const Nav = ({path, demo}) => {
  const location = useLocation(),
        history = useHistory(),
        pluginsState = useSelector(s => s.guild?.plugins),
        guilds = useSelector(s => s.guilds),
        [cookie, setCookie, removeCookie] = useCookies(['guild', 'account']),
        g = (guilds || []).find(g => g.id === cookie.guild)
  return <div className={cn(st.nav, {[st.page1]: location.pathname !== path})}>
    <div className={st.navPage}>
      {demo
      ? <div className={st.demoAlert}>DEMO MODE | Сhanges will be lost when the page is reloaded</div>
      : (guilds || []).map(g => <NavEl text={g.name} img={<div className={st.guildIcon} wa>
        {g.icon
          ? <img src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}`} />
          : String(g.name[0]).toUpperCase()}
        </div>} color={colors.grey} active={cookie.guild === g.id} onClick={() => setCookie('guild', g.id, {path: '/'})} textVisible />)}
    </div>
    <div className={st.navPage}>
      {pluginsState && <>
        <NavEl text="Plugins" img={<img className={st.dashboardImg} src="/static/img/arrow/left.png" />} to={path} color={colors.grey} m textVisible {...{history}} />
        {['levels', 'moderation', 'automod', 'embeds', 'counters', 'alerts', 'welcome', 'reactionRoles', 'music', 'poll', 'userRooms']
          .map(pl => {
            const api = pluginApi(pl)
            return <NavEl
              text={l(`plugin_${pl}`)}
              src={`/static/img/plugins/${pl}.png`}
              to={`${path}/${pl}`} color={colors[pl]}
              enabled={pluginsState[pl]?.enabled}
              active={location.pathname === `${path}/${pl}`}
              toggleEnabled={api?.enabled?.toggle} {...{history}} />
          })}
        <NavEl text="Members" src="/static/img/members.png" to={`${path}/members`} color={colors.grey} active={location.pathname === `${path}/members`} ml {...{history}} />
        <NavEl text="Settings" src="/static/img/settings.png" to={`${path}/settings`} color={colors.grey} active={location.pathname === `${path}/settings`} {...{history}} />
      </>}
    </div>
  </div>
}