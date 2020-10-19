import React, { useState, useEffect, useRef, memo } from 'react'
import cn from 'classnames'
import { useSelector } from 'react-redux'
import { colors } from './colorlist'
import Color from 'color'
import { Modal } from './modal'
import { Scroll } from './scroll'
import { Label } from './label'
import { useModal } from '../hooks/useModal'
import equal from 'fast-deep-equal'
import { diff } from 'deep-diff'
import { isEqual } from 'lodash'
import { useGuild } from '../hooks/useGuild'
import { Input } from './input'
import { MLabel } from './mlabel'

export const ObjectEdit = memo(props => {
  const [mState, open, close] = useModal({list: true, padding: false})
  const add = id => {
    props.add(id)
    close()
  }
  let ref = useRef()
  let list = []
  if (props.type === 'channels')
    list = [
      ...[{name: 'Text channels', type: 'group'}, ...useGuild.channels().text],
      ...[{name: 'Voice channels', type: 'group'}, ...useGuild.channels().voice]
    ]
  if (props.type === 'roles')
    list = useGuild.roles().list
  if (props.type === 'groups')
    list = useGuild.groups().list
  return (
    <div className={cn('object-edit-wr', props.className, {m: props.m, flex: props.flex})}>
      <MLabel d={props.label} />
      <div className="object-edit" ref={ref} onClick={e => e.stopPropagation()}>
        {props.data && props.data.length
          ? props.data.map((ch, i) => {
            let r
            if (props.type === 'channels' || props.type === 'roles' || props.type === 'groups') r = list ? list.find(r => r.id === ch) : {}
            else r = ch
            return (
              <div className="el" key={ch}>
                <div className="delete" onClick={() => props.delete(i)}><img src="/static/img/delete.png" className="delete-img" /></div>
                {r && r.name || '---'}
                {props.type === 'channels' && <div className="border" style={r && {background: colors.grey}} />}
                {props.type === 'roles' && <div className="border" style={r && {background: r.color !== 0 ? Color(r.color).hex() : colors.grey}} />}
                {(props.type === 'groups' || props.type === 'aliases') && <div className="border" style={r && {background: colors.grey}} />}
              </div>
            )
          })
          : props.default && <div className="el default">{props.default}<div className="border" style={{background: colors.dgrey}} /></div>}
        {props.input
          ? <Input set={props.add} clearOnSet b oe />
          : <div className={cn('add', {ml: !props.noML})} onClick={open}><img src="/static/img/add.png" /><div className="border" /></div>}
        <Modal id="object-edit" s={mState}>{list && list.map((r, i) => {
              if (r.type === 'group')
                return <Label bg p mt={i !== 0} key={i}>{r.name}</Label>
              if (props.type === 'channels')
                return <div className="obj-edit-el" onClick={() => add(r.id)} style={{borderColor: colors.grey}} key={i}>
                  {r.type === 'text' && <img src="/static/img/text.png" />}
                  {r.type === 'voice' && <img src="/static/img/voice.png" />}
                  {r.name}
                </div>
              if (props.type === 'roles')
                return <div className="obj-edit-el" onClick={() => add(r.id)} style={{borderColor: r.color !== 0 ? Color(r.color).hex() : colors.grey}} key={i}>{r.name}</div>
              if (props.type === 'groups')
                return <div className="obj-edit-el" onClick={() => add(r.id)} style={{borderColor: colors.grey}} key={r.id}>{r.name}</div>
            })}
        </Modal>
      </div>
    </div>
  )
}, isEqual)