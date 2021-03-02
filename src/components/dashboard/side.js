import React, { useState } from 'react'
import cn from 'classnames'
import { useSettings } from '../../hooks/settings.hook'
import { ConnectionState } from './connetionState'
import { Groups } from './groups'
import { useDispatch, useSelector } from 'react-redux'
import { useMenu } from '../../hooks/menu.hook'
import { ClientSettings } from './settings'

import st from './side.sass'

const Version = () => {
  const guild = useSelector(s => s.guild)
  return guild ? `V ${guild.v}` : ''
}

const SettingsButton = () => {
  const { toggle } = useMenu('settings')
  return <div className={st.settings} onClick={toggle}>
    <img src="/static/img/settings.png" />
  </div>
}

export const DashboardSide = () => {
  const [groupsOpen, setGroupsOpen] = useSettings('groupsOpen', true)
  const [logOpen, setLogOpen] = useSettings('logOpen', false)
  return (
  <div className={cn(st.side, {[st.open]: groupsOpen || logOpen})}>
    <Groups open={groupsOpen} setOpen={setGroupsOpen} />
    {/*<div className="side__el"><div className="side__el__label"><div className="side__el__label_in"><img src="/static/img/side/log.png" />Log</div><img src="/static/img/arrow/bottom.png" /></div></div>*/}
    <ClientSettings />
    <div className={st.info}>
      <div className={st.version}>
        <Version />
      </div>
      <ConnectionState />
      <SettingsButton />
    </div>
  </div>
)}