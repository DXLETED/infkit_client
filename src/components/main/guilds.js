import React, { useRef } from 'react'
import cn from 'classnames'
import { memo } from 'react'
import { useCookies } from 'react-cookie'
import { useSelector } from 'react-redux'
import { EdgedButton } from '../button'
import { Scroll } from '../scroll'
import { useScroll } from '../../hooks/scroll.hook'
import { useAddGuild } from '../../hooks/addguild.hook'

import st from './Guilds.sass'
import { colors } from '../colorlist'

const Guild = ({id, icon, name, bot}) => <div className={cn(st.guildPreview, {[st.bot]: bot})}>
  {icon ? <img src={`https://cdn.discordapp.com/icons/${id}/${icon}`} /> : <div className={st.icon}>{name.split(' ').length <= 1 ? name.split(' ')[0][0] : name.split(' ')[0][0] + name.split(' ')[1][0]}</div>}
  <div className={st.name}>{name}</div>
</div>

export const Guilds = memo(() => {
  const guilds = useSelector(s => s.guilds)
  const [cookie, setCookie] = useCookies(['guild'])
  const authorized = useSelector(s => s.authorized)
  const scrollTop = useScroll('.page#main > main', 2, 0, 200)
  const add = useAddGuild()
  const login = () => {
    window.open(
      `https://discord.com/api/oauth2/authorize?client_id=${SERVER_CONFIG.clientId}&redirect_uri=${SERVER_CONFIG.url}login&response_type=code&scope=identify%20email%20guilds`,
      'InfKit - Login',
      `width=500,height=800,top=${window.top.outerHeight / 2 + window.top.screenY - (800 / 2)},left=${window.top.outerWidth / 2 + window.top.screenX - (500 / 2)}`)
  }
  return <div className={st.guildsWr} style={{opacity: (800 - scrollTop) / 800}}>
    <Scroll className={st.guilds} deps={[guilds]} pl column>
      {authorized
        ? guilds?.length
          ? <>
            {guilds.map((g, i) =>
              <EdgedButton
                className={cn(st.guild)}
                onClick={() => g.bot
                  ? setCookie('guild', g.id, {path: '/'})
                  : add(g.id)}
                to={g.bot && '/dashboard'}
                borderColor={cookie.guild && g.bot ? g.id === cookie.guild ? colors.blue : null : colors.dgrey}
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