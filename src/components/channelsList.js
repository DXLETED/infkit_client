import React, { useState, useEffect, useRef } from 'react'
import cn from 'classnames'
import { Modal } from './modal'
import { useSelector } from 'react-redux'
import Color from 'color'
import { colors } from './colorlist'
import { Scroll } from './scroll'

export const ChannelsList = props => {
  const guild = useSelector(s => s.guild)
  const [open, setOpen] = useState(false)
  let openRef = useRef()
  const docClick = e => {
    if (!openRef.current) return
    if (e.target.closest('.modal')) {
      if (e.target.closest('.modal') !== ref.current) {
        setOpen(false)
      }
    } else {
      setOpen(false)
    }
  }
  const channelPick = id => {
    props.add(id)
    setOpen(false)
  }
  useEffect(() => {
    document.addEventListener('click', docClick)
    return () => document.removeEventListener('click', docClick)
  }, [])
  useEffect(() => {
    openRef.current = open
  }, [open])
  return (
    <div className={cn('channels-list', props.className)}>
      {props.channels.map((ch, i) => {
        let r = guild && guild.channels.find(r => r.id === ch)
        return (
          <div className="ch">
            <div className="delete" onClick={() => props.delete(i)}><img src="/static/img/delete.png" /></div>
            {r && r.name}
            <div className="border" style={r && {background: colors.grey}} />
          </div>
        )
      })}
      <div className="add" onClick={() => setOpen(true)}><img src="/static/img/add.png" /><div className="border" /></div>
      {open && <Modal id="channels"><Scroll><div className="channels">{guild.channels && guild.channels.filter(ch => ch.type === 'text' || ch.type === 'voice').sort((x, y) => x.rawPosition < y.rawPosition ? 1 : -1).sort((x, y) => x.type > y.type ? 1 : -1).map(r => <div className="ch" onClick={() => channelPick(r.id)} style={{borderColor: colors.grey}}>{r.name}</div>)}</div></Scroll></Modal>}
    </div>
  )
}