import React from 'react'
import cn from 'classnames'
import { useSettings } from '../../hooks/settings.hook'
import { ConnectionState } from './connetionState'
import { Groups } from './groups'
import { useSelector } from 'react-redux'

const Version = () => {
  const guild = useSelector(s => s.guild)
  return guild ? `v${guild.v}` : ''
}

export const DashboardSide = () => {
  const [groupsOpen, setGroupsOpen] = useSettings('groupsOpen', true)
  const [logOpen, setLogOpen] = useSettings('logOpen', false)
  return (
  <div className={cn('side', {open: groupsOpen || logOpen})}>
    <Groups open={groupsOpen} setOpen={setGroupsOpen} />
    {/*<div className="side__el"><div className="side__el__label"><div className="side__el__label_in"><img src="/static/img/side/log.png" />Log</div><img src="/static/img/arrow/bottom.png" /></div></div>*/}
    <div className="side__info">
      <div className="side__info__version"><Version /></div>
      <ConnectionState />
    </div>
  </div>
)}