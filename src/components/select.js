import React, { useState, useEffect, useRef, memo } from 'react'
import cn from 'classnames'
import { Scroll } from './scroll'
import { useGuild } from '../hooks/useGuild'
import equal from 'fast-deep-equal'
import { isEqual } from 'lodash'
import { MLabel } from './mlabel'
import { DropdownList } from './dropdownList'
import { vh } from './cssVar'

export const Select = memo(props => {
  const [open, setOpen] = useState(false)
  let ref = useRef()
  let dropdown
  if (props.type === 'text')
    dropdown = useGuild.channels().text
  else if (props.type === 'voice')
    dropdown = useGuild.channels().voice
  else if (props.type === 'category')
    dropdown = useGuild.channels().categories
  else if (props.type === 'role')
    dropdown = useGuild.roles().list
  else if (props.type === 'reason/mute')
    dropdown = useGuild.reasons.mute().list
  else if (props.type === 'reason/kick')
    dropdown = useGuild.reasons.kick().list
  else if (props.type === 'reason/ban')
    dropdown = useGuild.reasons.ban().list
  else
    dropdown = props.dropdown || []
  if (props.add)
    dropdown = [...props.add, ...dropdown]
  if (props.end)
    dropdown = [...dropdown, ...props.end]
  const docClick = e => {
    if (e.target.closest('.select')) {
      if (e.target.closest('.select') !== ref.current) {
        setOpen(false)
      }
    } else {
      setOpen(false)
    }
  }
  useEffect(() => {
    document.addEventListener('click', docClick)
    return () => document.removeEventListener('click', docClick)
  }), []
  const name = i => {
    if (props.type === 'category' || props.type === 'text' || props.type === 'voice' || props.type === 'role' || props.type === 'actions')
      return dropdown.find(el => el.id === i) ? dropdown.find(el => el.id === i).name : dropdown[0].name
    if (props.type === 'reason/mute') {
      const e = dropdown.find(el => el.id === i)
      if (!e) return ''
      return `${e.reason}${e.time && false ? ` [Text: ${e.muteTime.text} | Voice: ${e.muteTime.voice}]` : ''}`
    }
    if (props.type === 'reason/kick') {
      const e = dropdown.find(el => el.id === i) || dropdown[0]
      if (!e) return ''
      return e.reason
    }
    if (props.type === 'reason/ban') {
      const e = dropdown.find(el => el.id === i) || dropdown[0]
      if (!e) return ''
      return `${e.reason}${e.time && false ? ` [${e.time}]` : ''}`
    }
    if (props.type === 'options')
      return dropdown[props.options.findIndex(el => el === i)]
    return dropdown[i]
  }
  const nameLIST = (el, i) => {
    if (props.type === 'category' || props.type === 'text' || props.type === 'voice' || props.type === 'role' || props.type === 'actions')
      return el.name
    if (props.type === 'reason/mute')
      return `${el.reason}${el.time ? ` [Text: ${el.time.text} | Voice: ${el.time.voice}]` : ''}`
    if (props.type === 'reason/kick')
      return el.reason
    if (props.type === 'reason/ban')
      return `${el.reason}${el.time ? ` [${el.time}]` : ''}`
    return el
  }
  const id = i => {
    if (props.type === 'category' || props.type === 'text' || props.type === 'voice' || props.type === 'role' || props.type === 'actions' || props.type === 'reason/mute' || props.type === 'reason/kick' || props.type === 'reason/ban')
      return dropdown[i].id
    if (props.type === 'options')
      return props.options[i]
    return i
  }
  return (
    <div className={cn('select-wr', props.className, {m: props.m, mr: props.mr, flex: props.flex, requirederr: props.required && !props.selected})} style={{width: props.width && vh(props.width)}}>
      <MLabel d={props.label} />
      <div className="select" ref={ref}>
    <div className="select-label-wr" onClick={() => setOpen(!open)}><div className="select-label">{props.prefix}{name(props.selected)}{props.ending}</div><div className="arrow"><img src={open ? '/static/img/arrow/top.png' : '/static/img/arrow/bottom.png'} /></div></div>
        {!props.noborder && <div className="border" />}
        <DropdownList list={dropdown.map((item, i) => ({
          id: id(i),
          name: nameLIST(item, i),
          selected: props.selected === i,
          set: () => props.set(id(i)),
          click: item.click
        }))} visible={open} close={() => setOpen(false)} />
      </div>
    </div>
  )
}, isEqual)