import React, { Fragment } from 'react'
import { EditableList } from '../components/editableList'
import { useSelector } from 'react-redux'
import { Select } from '../components/select'
import cn from 'classnames'
import { generateId } from '../utils/generateId'
import { useGuild } from '../hooks/useGuild'
import { useRef } from 'react'
import { Input } from '../components/input'
import { notify } from '../components/notify'

const MsgTips = ({ tips, add }) => tips.map(([text, description], i) => <div className="tip" onClick={() => add(`[${text}]`)} key={i}>[{text}]<span className="tip__description">&nbsp;- {description}</span></div>)

export const Counters = props => {
  const { state, api } = props
  const guild = useSelector(s => s.guild)
  const inputAdd = useRef()
  if (!guild) return <></>
  return (
    <>
      <EditableList data={state.d.map((c, i) => {
        return <Fragment key={c.id}>
          <Select type="category" selected={c.category} add={[{id: null, name: 'Category not selected'}, c.type !== 2 && {id: '<root>', name: '<root>'}].filter(Boolean)} set={n => api.setCategory(i, n)} m />
          <Select selected={c.type} dropdown={['Server', 'Role', 'Reaction Roles']} set={n => api.setType(i, n)} m />
          {c.type === 1 && <Select type="role" selected={c.role} add={[{id: null, name: 'Role not selected'}]} set={n => api.setRole(i, n)} m />}
          <Input value={c.name} placeholder="Channel name" set={n => api.setName(i, n)} addFn={fn => inputAdd.current = fn} b m />
          <div className="msg-tips">
            {c.type === 0 && <>
              <MsgTips tips={[
                ['members', 'Member count'],
                ['members_online', 'Number of a members online (without bots)'],
                ['members_offline', 'Number of a members offline (without bots)'],
                ['bots', 'Bot count'],
                ['channels', 'Channel count']
              ]} add={n => api.setName(i, c.name.concat(n))} />
            </>}
            {c.type === 1 && <>
              <MsgTips tips={[
                ['role_name', 'Role name'],
                ['role_amount', 'Number of members who have a role']
              ]} add={n => api.setName(i, c.name.concat(n))} />
            </>}
          </div>
        </Fragment>})}
      addLabel="Add counter"
      add={api.create}
      delete={d => notify.question({description: 'Delete channel?', options: [['Yes', () => api.del(d, true)], ['No', () => api.del(d, false)], ['Cancel']]})}
      column p={1} />
    </>
  )
}

/*
import React from 'react'

export const Counters = props => {
  let state = props.state
  const update = () => props.updateState(state)
  return (
    <></>
  )
}
*/