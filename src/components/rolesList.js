import React, { useState, useEffect, useRef } from 'react'
import cn from 'classnames'
import { Modal } from './modal'
import { useSelector } from 'react-redux'
import Color from 'color'
import { Scroll } from './scroll'

export const RolesList = props => {
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
  const rolePick = id => {
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
    <div className={cn('role-input', props.className)}>
      {props.roles.map((role, i) => {
        let r = guild && guild.roles.find(r => r.id === role)
        return (
          <div className="role">
            <div className="delete" onClick={() => props.delete(i)}><img src="/static/img/delete.png" /></div>
            {r && r.name}
            <div className="border" style={r && {background: r.color !== 0 ? Color(r.color).hex() : '#939393'}} />
          </div>
        )
      })}
      <div className="add" onClick={() => setOpen(true)}><img src="/static/img/add.png" /><div className="border" /></div>
      {open && <Modal id="roles"><Scroll><div className="roles">{guild.roles && guild.roles.sort((x, y) => x.rawPosition < y.rawPosition ? 1 : -1).map(r => <div className="role" onClick={() => rolePick(r.id)} style={{borderColor: r.color !== 0 ? Color(r.color).hex() : '#939393'}}>{r.name}</div>)}</div></Scroll></Modal>}
    </div>
  )
}