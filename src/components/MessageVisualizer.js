import React from 'react'
import cn from 'classnames'
import { useAuth } from '../hooks/auth.hook'
import { Component } from './Component'
import { Embed } from './embed/Embed'
import { Markdown } from './embed/Markdown'
import { MarkdownEmoji } from './embed/MarkdownEmoji'
import st from './MessageVisualizer.sass'

export const MessageVisualizer = ({avatar, username, msg = {}, reacts, bot, ...props}) => {
  const { isAuthenticated, user } = useAuth()
  return <Component cln={st.messageVisualizer} rw={[st, ['maxwidth']]} {...props}>
    <div className={st.avatar} style={{backgroundImage: `url(${avatar || (bot
      ? 'https://cdn.discordapp.com/avatars/722448416575062016/2a30581345547c4382c91ba3cf6855d4.webp?size=128'
      : user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        : 'https://cdn.discordapp.com/embed/avatars/0.png')})`}} />
    <div className={st.message}>
      <div className={st.author}>
        {username || (bot ? 'InfinityKit' : isAuthenticated ? user.username : 'USERNAME')}{bot && <div className={st.bot}>BOT</div>}
      </div>
      {msg.content && <div className={cn(st.content, {[st.m]: msg.embed})}><Markdown str={msg.content} /></div>}
      {msg.embed && <Embed d={msg.embed} w100={props.w100} />}
      {reacts && <div className={st.reacts}>{reacts.map(({e, count}) => <div className={st.react}><MarkdownEmoji str={e} inline /> {count}</div>)}</div>}
    </div>
  </Component>
}