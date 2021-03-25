import React, { useRef } from 'react'
import cn from 'classnames'
import { memo } from 'react'
import { useCookies } from 'react-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { EdgedButton } from '../button'
import { Scroll } from '../scroll'
import { useScroll } from '../../hooks/scroll.hook'
import socketIOClient from 'socket.io-client'
import { useHistory } from 'react-router'

import st from './Guilds.sass'
import { colors } from '../colorlist'

const Guild = ({id, icon, name, bot}) => <div className={cn(st.guildPreview, {[st.bot]: bot})}>
  {icon ? <img src={`https://cdn.discordapp.com/icons/${id}/${icon}`} /> : <div className={st.icon}>{name.split(' ').length <= 1 ? name.split(' ')[0][0] : name.split(' ')[0][0] + name.split(' ')[1][0]}</div>}
  <div className={st.name}>{name}</div>
</div>

export const Guilds = memo(() => {
  const guilds = useSelector(s => s.guilds)
  const [cookie, setCookie] = useCookies(['guild'])
  const dispatch = useDispatch()
  const history = useHistory()
  const authorized = useSelector(s => s.authorized)
  const scrollTop = useScroll('.page#main > main', 2, 0, 200)
  const ioRef = useRef()
  const addGuild = id => {
    ioRef.current && ioRef.current.disconnect()
    const w = window.open(
      `https://discord.com/oauth2/authorize?client_id=${SERVER_CONFIG.clientId}&scope=bot&permissions=8&redirect_uri=${SERVER_CONFIG.url}joinGuild&guild_id=${id}`,
      'Add guild',
      `width=500,height=800,top=${window.top.outerHeight / 2 + window.top.screenY - (800 / 2)},left=${window.top.outerWidth / 2 + window.top.screenX - (500 / 2)}`)
    const io = socketIOClient({path: '/socket/awaitForJoin'})
    ioRef.current = io
    io.emit('init', id)
    io.on('joined', () => {
      setCookie('guild', id)
      history.push('/dashboard')
      w.close()
      io.disconnect()
    })
  }
  const login = () => {
    window.open(
      `https://discord.com/api/oauth2/authorize?client_id=${SERVER_CONFIG.clientId}&redirect_uri=${SERVER_CONFIG.url}login&response_type=code&scope=identify%20email%20guilds`,
      'InfKit - Login',
      `width=500,height=800,top=${window.top.outerHeight / 2 + window.top.screenY - (800 / 2)},left=${window.top.outerWidth / 2 + window.top.screenX - (500 / 2)}`)
  }
  return <div className={st.guildsWr} style={{opacity: (800 - scrollTop) / 800}}>
    <Scroll className={st.guilds} deps={[guilds]} pl column>
      {authorized
        ? guilds
          ? <>
            {guilds.map((g, i) =>
              <EdgedButton
                className={cn(st.guild, {selected: cookie.guild && g.id === cookie.guild, enabled: g.bot})}
                onClick={() => g.bot
                  ? setCookie('guild', g.id, {path: '/'})
                  : addGuild(g.id)}
                to={g.bot && '/dashboard'}
                borderColor={cookie.guild && g.id === cookie.guild ? colors.blue : null}
                key={i}
              >
                <Guild {...g} />
              </EdgedButton>)}
          </>
          : <EdgedButton to="/dashboard">Guilds not found</EdgedButton>
        : <>
          <EdgedButton className={st.login} onClick={() => login()} m><img src="/static/img/login.png" />LOG IN</EdgedButton>
          <EdgedButton className={st.login} to="/demo"><img src="/static/img/demo.png" />DEMO</EdgedButton>
        </>}
    </Scroll>
  </div>
})