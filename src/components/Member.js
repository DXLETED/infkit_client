import React from 'react'
import { useGuild } from '../hooks/useGuild'
import { Component } from './Component'
import st from './Member.sass'

export const Member = ({id, ...props}) => {
  const members = useGuild.members([id])
  const m = members.get(id)
  return <Component cln={st.member} rw={[st, ['bg']]} {...props}>
    <img className={st.avatar} src={m.avatar ? `https://cdn.discordapp.com/avatars/${m.id}/${m.avatar}.png?size=64` : 'https://discord.com/assets/322c936a8c8be1b803cd94861bdfa868.png'} />
    {m.nickname || m.username}
  </Component>
}