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
import cn from 'classnames'

import st from './counters.sass'
import { Category } from '../components/Category'

const MsgTips = ({ tips, add }) => tips.map(([text, description], i) => <div className="tip" onClick={() => add(`[${text}]`)} key={i}>[{text}]<span className="tip__description">&nbsp;- {description}</span></div>)

const Update = ({c, api, n}) => <div className={cn(st.update, {[st.n]: n})} onClick={e => e.stopPropagation()}>
  <div className={st.lastUpdate}>Last update {c.lastUpdate ? moment(c.lastUpdate).fromNow() : '-----'}</div>
  <div className={st.updateNow} onClick={api.upd}><span>Update now</span></div>
</div>

const Counter = ({c, api, layout}) => {
  const inputAdd = useRef()
  const prepareString = str => {
    switch (c.type) {
      case 1: return str
        .replace('[members]', '{value}')
        .replace('[members_online]', '{value}')
        .replace('[members_offline]', '{value}')
        .replace('[bots]', '{value}')
        .replace('[channels]', '{value}')
      default: return str
    }
  }
  return <ExpansionPanel header={
    <Row elements={[
      {width: 4, marginRight: 0, el: <PreviewChannel name={prepareString(c.name)} type="voice" />},
      !layout.ap3 && {width: 0, el: <Update {...{c, api}} />}
    ]} flex />}
    dropdown={
      <>
        {layout.ap3 && <Update n {...{c, api}} />}
        <Row elements={[
          <Select label="Category" type="category" selected={c.category} add={[{id: null, name: 'Category not selected'}, c.type !== 2 && {id: '<root>', name: '<root>'}].filter(Boolean)} set={api.set.category} required m />,
          <Select label="Type" selected={c.type} dropdown={['Server', 'Role', 'Reaction Roles']} set={api.set.type} m />
        ]} column={layout.ap3} m />
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
      </>} key={c.id} p column np />
}

export const Counters = ({state, api, layout}) => <>
  <Category>
    <EditableList data={state.d.map((c, i) => {
      return <Counter c={c} i={i} api={api.counter(i)} {...{layout}} />})}
    label="Channels"
    addLabel="Add counter"
    add={api.create}
    delete={d => notify.question({description: 'Delete channel?', options: [['Yes', () => api.counter(d).del(true)], ['No', () => api.counter(d).del(false)], ['Cancel']]})}
    limit={2} />
  </Category>
</>