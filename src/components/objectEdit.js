import React, { useRef, memo } from 'react'
import cn from 'classnames'
import { colors } from './colorlist'
import Color from 'color'
import { Modal } from './modal'
import { Label } from './label'
import { useModal } from '../hooks/useModal'
import { isEqual } from 'lodash'
import { useGuild } from '../hooks/useGuild'
import { Input } from './input'
import { MLabel } from './mlabel'

import st from './ObjectEdit.sass'

export const ObjectEdit = memo(props => {
  const type = props.type
  const [mState, open, close] = useModal({list: true, padding: false})
  const add = (t, id) => {
    props.add(props.isGroup ? id : id ? {t, id} : {t})
    close()
  }
  let ref = useRef()
  const roles = useGuild.roles()
  const channels = useGuild.channels()
  const groups = useGuild.groups()
  let list = []
  if (type === 'channels')
    list = [
      ...[{name: 'Text channels', type: 'class'}, ...useGuild.channels().text],
      ...[{name: 'Voice channels', type: 'class'}, ...useGuild.channels().voice]
    ]
  if (type === 'roles')
    list = [
      {name: 'Roles', type: 'class'},
      ...useGuild.roles().list
    ]
  if (type === 'groups')
    list = useGuild.groups().list
  return (
    <div className={cn(st.objectEditWr, props.className, {[st.m]: props.m, [st.flex]: props.flex, disabled: props.disabled, [st.right]: props.right})}>
      <MLabel d={props.label} />
      <div className={st.objectEdit} ref={ref} onClick={e => e.stopPropagation()}>
        {(props.data && props.data.length)
        ? props.data.map((r = {}, i) => <>
          <div className={cn(st.el, {[st.group]: r.t === 'group'})} key={r.id || i}>
            <div className={st.delete} onClick={() => props.delete(i)}><img src="/static/img/delete.png" className="deleteImg" /></div>
            {(() => {
              if (props.isGroup) {
                switch (type) {
                  case 'roles': {
                    const c = roles.get(r)
                    return <>{c.name || '---'}<div className={st.border} style={c && {background: (c.color !== 0 && c.color !== undefined) ? Color(c.color).hex() : colors.grey}} /></>
                  }
                  case 'channels': {
                    const c = channels.get(r)
                    return <>{c.name || '---'}<div className={st.border} /></>
                  }
                }
              } else if (props.type === 'aliases') {
                return <>{r}<div className={st.border} style={r && {background: colors.grey}} /></>
              } else {
                switch (r.t) {
                  case 'role': {
                    const c = roles.get(r.id)
                    return <>{c.name || '---'}<div className={st.border} style={c && {background: (c.color !== 0 && c.color !== undefined) ? Color(c.color).hex() : colors.grey}} /></>
                  }
                  case 'channel': {
                    const c = channels.get(r.id)
                    return <>{c.name || '---'}<div className={st.border} /></>
                  }
                  case 'group': {
                    const c = groups.get(r.id)
                    return <>
                      <img src="/static/img/group.png" />
                      {c.name || '---'}
                      <div className={st.border} />
                    </>
                  }
                }
              }
            })()}
          </div>
          {r.t === 'group' && (() => {
            const c = groups.get(r.id)
            return <>
              {(type === 'roles' && c.roles && c.roles.map((role, i) => <div className={cn(st.details, {[st.last]: i === c.roles.length - 1})}>{roles.get(role).name}<div className={st.border} /></div>))}
              {(type === 'channels' && c.channels && c.channels.map((ch, i) => <div className={cn(st.details, {[st.last]: i === c.channels.length - 1})}>{channels.get(ch).name}<div className={st.border} /></div>))}
            </>
          })()}
        </>)
        : props.default && <div className={cn(st.el, st.default)}>{props.default}<div className={st.border} style={{background: colors.dgrey}} /></div>}
        {props.input
          ? <Input set={props.add} clearOnSet b oe />
          : <div className={cn(st.add, {ml: !props.noML})} onClick={open}><img src="/static/img/add.png" /><div className={st.border} /></div>}
        <Modal id="object-edit" s={mState}>
          {!props.isGroup && !!groups.list.length && <>
            <Label p>Groups</Label>
            {groups.list.map(gr => <div className={cn('obj-edit-el', {disabled: (props.data || []).find(rr => rr.id === gr.id)})} onClick={() => add('group', gr.id)} style={{borderColor: colors.grey}} key={gr.id}>{gr.name}</div>)}
          </>}
          {list.sort((x, y) => y.rawPosition - x.rawPosition).map((r, i) => {
            if (r.type === 'class') return <Label p mt={!props.isGroup || i !== 0}>{r.name}</Label>
            switch (type) {
              case 'roles':
                return <div className={cn('obj-edit-el', {disabled: (props.data || []).find(rr => rr.id === r.id)})} onClick={() => add('role', r.id)} style={{borderColor: r.color !== 0 ? Color(r.color).hex() : colors.grey}} key={i}>{r.name}</div>
              case 'channels':
                return <div className={cn('obj-edit-el', {disabled: (props.data || []).find(rr => rr.id === r.id)})} onClick={() => add('channel', r.id)} style={{borderColor: colors.grey}} key={i}>
                    {r.type === 'text' && <img src="/static/img/text.png" />}
                    {r.type === 'voice' && <img src="/static/img/voice.png" />}
                    {r.name}
                  </div>
            }
          })}
        </Modal>
      </div>
    </div>
  )
}, isEqual)