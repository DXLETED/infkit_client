import React, { Fragment } from 'react'
import { EditableList } from '../components/editableList'
import { useSelector } from 'react-redux'
import { Select } from '../components/select'
import { useRef } from 'react'
import { Input } from '../components/input'
import { notify } from '../components/notify'
import { PreviewChannel } from '../components/PreviewChannel'
import { Row } from '../components/row'
import { ExpansionPanel } from '../components/expansionPanel'
import moment from 'moment'

import st from './counters.sass'

const MsgTips = ({ tips, add }) => tips.map(([text, description], i) => <div className="tip" onClick={() => add(`[${text}]`)} key={i}>[{text}]<span className="tip__description">&nbsp;- {description}</span></div>)

const Counter = ({c, api}) => {
  const inputAdd = useRef()
  return <ExpansionPanel header={
    <Row elements={[
      {width: 4, marginRight: 0, el: <PreviewChannel name={c.name
        .replace('[members]', '{value}')
        .replace('[members_online]', '{value}')
        .replace('[members_offline]', '{value}')
        .replace('[bots]', '{value}')
        .replace('[channels]', '{value}')} type="voice" />},
      {width: 0, el: <div className={st.update} onClick={e => e.stopPropagation()}>
        <div className={st.lastUpdate}>Last update {c.lastUpdate ? moment(c.lastUpdate).fromNow() : '-----'}</div>
        <div className={st.updateNow} onClick={api.upd}><span>Update now</span></div>
      </div>}
    ]} flex />}
    dropdown={
      <>
        <Row elements={[
          <Select label="Category" type="category" selected={c.category} add={[{id: null, name: 'Category not selected'}, c.type !== 2 && {id: '<root>', name: '<root>'}].filter(Boolean)} set={api.set.category} required m />,
          <Select label="Type" selected={c.type} dropdown={['Server', 'Role', 'Reaction Roles']} set={api.set.type} m />
        ]} m />
        {c.type === 1 && <Select type="role" selected={c.role} add={[{id: null, name: 'Role not selected'}]} set={api.set.role} m />}
        <Input label="Channel name" value={c.name} set={api.set.name} addFn={fn => inputAdd.current = fn} defsize p b m />
        <div className="msg-tips">
          {c.type === 0 && <>
            <MsgTips tips={[
              ['members', 'Member count'],
              ['members_online', 'Number of a members online (without bots)'],
              ['members_offline', 'Number of a members offline (without bots)'],
              ['bots', 'Bot count'],
              ['channels', 'Channel count']
            ]} add={n => api.set.name(c.name.concat(n))} />
          </>}
          {c.type === 1 && <>
            <MsgTips tips={[
              ['role_name', 'Role name'],
              ['role_amount', 'Number of members who have a role']
            ]} add={n => api.set.name(c.name.concat(n))} />
          </>}
        </div>
      </>} key={c.id} column np />
}

export const Counters = props => {
  const { state, api } = props
  return (
    <>
      <EditableList data={state.d.map((c, i) => {
        return <Counter c={c} i={i} api={api.counter(i)} />})}
      addLabel="Add counter"
      add={api.create}
      delete={d => notify.question({description: 'Delete channel?', options: [['Yes', () => api.counter(d).del(true)], ['No', () => api.counter(d).del(false)], ['Cancel']]})}
      limit={2} />
    </>
  )
}