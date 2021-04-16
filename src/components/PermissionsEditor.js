import Color from 'color'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { useGuild } from '../hooks/useGuild'
import { Component } from './Component'
import { MLabel } from './mlabel'
import st from './PermissionsEditor.sass'
import { Svg } from './svg'
import cn from 'classnames'
import { Scroll } from './scroll'
import { Tabs } from './Tabs'
import { customUpdate } from '../api'
import { useLayout } from '../hooks/layout.hook'

const permissionsApi = (u => ({
  access: {
    toggle: {
      private: () => u(p => p.access.private = !p.access.private)
    },
    add: n => u(p => {
      if (p.access.private) {
        if (!p.access.allow) p.access.allow = []
        p.access.allow.push(n)
      } else {
        if (!p.access.deny) p.access.deny = []
        p.access.deny.push(n)
      }
    }),
    del: d => u(p => {
      if (p.access.private) {
        p.access.allow = p.access.allow.filter(el => el.id !== d)
        if (!p.access.allow.length) delete p.access.allow
      } else {
        p.access.deny = p.access.deny.filter(el => el.id !== d)
        if (!p.access.deny.length) delete p.access.deny
      }
    })
  },
  channels: {
    toggle: {
      private: () => u(p => p.channels.private = !p.channels.private)
    },
    add: n => u(p => {
      if (p.channels.private) {
        if (!p.channels.allow) p.channels.allow = []
        p.channels.allow.push(n)
      } else {
        if (!p.channels.deny) p.channels.deny = []
        p.channels.deny.push(n)
      }
    }),
    del: d => u(p => {
      if (p.channels.private) {
        p.channels.allow = p.channels.allow.filter(el => el.id !== d)
        if (!p.channels.allow.length) delete p.channels.allow
      } else {
        p.channels.deny = p.channels.deny.filter(el => el.id !== d)
        if (!p.channels.deny.length) delete p.channels.deny
      }
    })
  }
}))

const PermissionsList = ({lists, placeholder, ...props}) => {
  const roles = useGuild.roles()
  const members = useGuild.membersCache()
  const channels = useGuild.channels()
  const groups = useGuild.groups()
  const visualize = {
    member: id => {
      const member = members.get(id)
      return <>
        <img className={st.avatar} src={member.avatar ? `https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.png?size=64` : 'https://discord.com/assets/322c936a8c8be1b803cd94861bdfa868.png'} />
        {member.name}
      </>
    },
    role: id => {
      const role = roles.get(id)
      return <>
        {role.name}
        <div className={st.color} style={{background: role.color && Color(role.color)}} />
      </>
    },
    channel: id => {
      const channel = channels.get(id)
      return <>
        {channel.name}
        <div className={st.color} />
      </>
    },
    group: id => {
      const group = groups.get(id)
      return <>
        <Svg className={st.icon} k="group" size={18} />
        {group.name}
      </>
    }
  }
  const list = (state, t, svg, groups) => state && state.find(el => el.t === t || (groups && el.t === 'group')) && <div className={st.list}>
    {svg}
    <div className={st.els}>
      {state.filter(el => el.t === t || (groups && el.t === 'group')).map(el => {
        return <div className={cn(st.el, st[el.t])} key={el.id}>
          {el.t === 'group' ? visualize.group(el.id) : visualize[t](el.id)}
        </div>
      })}
    </div>
  </div>
  return <Component cln={st.permissionsList} {...props}>
    {placeholder && <div className={st.placeholder}>{placeholder}</div>}
    {lists.map(l => list(...l))}
  </Component>
}

const PrivateButton = ({p, toggle}) => <div className={st.privateButton} onClick={() => toggle()}>
  {p
    ? <Svg className={st.icon} k="lock" color="#ffbe26" size={16} />
    : <Svg className={st.icon} k="unlock" size={16} />}
  {p ? 'PRIVATE' : 'PUBLIC'}
</div>

const SelectEl = ({id, p, d, add, del, children}) => {
  const selected = ((p.private ? p.allow : p.deny) || []).find(el => el.id === id)
  return <div
    className={cn(st.el, {[st.selected]: selected, [st.deny]: !p.private})}
    onClick={() => selected ? del(d.id) : add(d)}>
    <img className={st.enabled} src={`/static/img/${p.private ? 'done' : 'delete'}.png`} />
    <div className={st.content}>{children}</div>
  </div>
}

export const PermissionsEditor = ({label, state, set, admins, privateOnly, ...props}) => {
  const [isOpen, setIsOpen] = useState(false)
  const api = permissionsApi(customUpdate(upd => set(upd(state))))
  const layout = useLayout()
  const roles = useGuild.roles()
  const channels = useGuild.channels()
  const groups = useGuild.groups()
  return <Component cln={st.permissionsEditor} {...props}>
    <MLabel d={label} />
    <div className={cn(st.inner, {[st.extended]: !!state.access && !!state.channels})}>
      {state.access && <div className={cn(st.t, {[st.private]: state.access.private})} onClick={() => setIsOpen(true)}>
        <div className={st.private}>
          {state.access.private
            ? <Svg k="lock" color="#ffbe26" size={18} />
            : <Svg k="unlock" size={18} />}
        </div>
        <PermissionsList lists={[
          [state.access.private ? state.access.allow : state.access.deny, 'role', <Svg className={st.type} k="role" color={state.access.private ? '#0097b6' : '#d03361'} />, true],
          [state.access.private ? state.access.allow : state.access.deny, 'member']
        ]} placeholder={state.access.private
          ? (!state.access.allow?.length && (admins ? 'DISCORD ADMINISTRATORS' : 'ADMINISTRATORS'))
          : (!state.access.deny?.length && 'EVERYONE')} flex />
      </div>}
      {state.channels && <div className={cn(st.t, {[st.private]: state.channels.private})} onClick={() => setIsOpen(true)}>
        <div className={st.private}>
          <Svg k="textChannel" size={18} />
          {state.channels.private && <div className={st.lock}></div>}
        </div>
        <PermissionsList lists={[
          [state.channels.private ? state.channels.allow : state.channels.deny, 'channel', <Svg className={st.type} k="textChannel" color={state.channels.private ? '#0097b6' : '#d03361'} />, true]
        ]} placeholder={state.channels.private
          ? (!state.channels.allow?.length && 'CHANNELS NOT SELECTED')
          : (!state.channels.deny?.length && 'ANY CHANNEL')} flex />
      </div>}
    </div>
    {ReactDOM.createPortal(<div className={cn(st.permissionsOverlay, {[st.isOpen]: isOpen})}>
      <div className="fill" onClick={() => setIsOpen(false)} />
      <div className={st.main}>
        <Tabs pages={[
          state.access && ['access', 'ACCESS', <>
            <div className={st.olist}>
              <PermissionsList lists={[
                [state.access.private ? state.access.allow : state.access.deny, 'role', <Svg className={st.type} k="role" color={state.access.private ? '#0097b6' : '#d03361'} />, true],
                [state.access.private ? state.access.allow : state.access.deny, 'member']
              ]} placeholder={state.access.private
                ? (!state.access.allow?.length && (admins ? 'DISCORD ADMINISTRATORS' : 'ADMINISTRATORS'))
                : (!state.access.deny?.length && 'EVERYONE')} flex />
            </div>
            {!privateOnly && <PrivateButton p={state.access.private} toggle={api.access.toggle.private} />}
            <div className={st.select}>
              <Scroll column pl>
                {!!groups.list.length && <div className={st.category}>GROUPS</div>}
                {groups.list.map(g => <SelectEl id={g.id} p={state.access}
                d={{t: 'group', id: g.id}}
                add={api.access.add}
                del={api.access.del} key={g.id}>
                  <Svg className={st.icon} k="group" size={18} />
                  {g.name}
                </SelectEl>)}
                <div className={st.category}>ROLES</div>
                {roles.list.sort((x, y) => y.rawPosition - x.rawPosition).map(role => <SelectEl id={role.id} p={state.access}
                d={{t: 'role', id: role.id}}
                add={api.access.add}
                del={api.access.del} key={role.id}>
                  <Svg className={st.icon} k="role" size={18} color={role.color && Color(role.color)} />
                  {role.name}
                </SelectEl>)}
              </Scroll>
            </div>
          </>],
          state.channels && ['channels', 'CHANNELS', <>
            <div className={st.olist}>
              <PermissionsList lists={[
                [state.channels.private ? state.channels.allow : state.channels.deny, 'channel', <Svg className={st.type} k="textChannel" color={state.channels.private ? '#0097b6' : '#d03361'} />, true]
              ]} placeholder={state.channels.private
                ? (!state.channels.allow?.length && 'CHANNELS NOT SELECTED')
                : (!state.channels.deny?.length && 'ANY CHANNEL')} flex />
            </div>
            {!privateOnly && <PrivateButton p={state.channels.private} toggle={api.channels.toggle.private} />}
            <div className={st.select}>
              <Scroll column pl>
                {!!groups.list.length && <div className={st.category}>GROUPS</div>}
                {groups.list.map(g => <SelectEl id={g.id} p={state.channels}
                d={{t: 'group', id: g.id}}
                add={api.channels.add}
                del={api.channels.del} key={g.id}>
                  <Svg className={st.icon} k="group" size={18} />
                  {g.name}
                </SelectEl>)}
                <div className={st.category}>TEXT CHANNELS</div>
                {channels.list.filter(ch => ch.type === 'text').map(ch => <SelectEl id={ch.id} p={state.channels}
                d={{t: 'channel', id: ch.id}}
                add={api.channels.add}
                del={api.channels.del} key={ch.id}>
                  <Svg className={st.icon} k="textChannel" size={18} />
                  {ch.name}
                </SelectEl>)}
                <div className={st.category}>VOICE CHANNELS</div>
                {channels.list.filter(ch => ch.type === 'voice').map(ch => <SelectEl id={ch.id} p={state.channels}
                d={{t: 'channel', id: ch.id}}
                add={api.channels.add}
                del={api.channels.del} key={ch.id}>
                  <Svg className={st.icon} k="voiceChannel" size={18} />
                  {ch.name}
                </SelectEl>)}
              </Scroll>
            </div>
          </>]
        ].filter(Boolean)} />
        {layout.ap2 && <div className={st.close} onClick={() => setIsOpen(false)}>CLOSE</div>}
      </div>
      <div className="fill" onClick={() => setIsOpen(false)} />
    </div>, document.querySelector('.overlays'))}
  </Component>
}