import React, { useState } from 'react'
import { EditableList } from '../components/editableList'
import { useSelector } from 'react-redux'
import { Select } from '../components/select'
import TextareaAutosize from 'react-textarea-autosize'
import { Label } from '../components/label'
import { MultiSwitch } from '../components/multiSwitch'
import { Emoji } from '../components/emoji'
import { ObjectEdit } from '../components/objectEdit'
import { TextArea } from '../components/textarea'
import { useGuild } from '../hooks/useGuild'
import { notify } from '../components/notify'
import { emojis } from '../components/emojis'
import { Category } from '../components/Category'
import { MessageEditor } from '../components/MessageEditor'

const generateId = arr => {
  const rnd = ''
  while (rnd.length < 8)
    rnd += Math.random().toString(36).substring(2)
  if (arr.includes(rnd))
    return generateId(arr)
  return rnd
}

const MsgReact = ({state, api}) => <>
  <div className="emoji"><Emoji current={state.emoji} set={n => api.set.emoji(n.label)} disabled={state.emoji} mr /></div>
  <ObjectEdit type="roles" data={state.roles}
    add={api.roles.add}
    delete={api.roles.del} />
</>

const Msg = ({g, api, channels}) => <>
  {g.channel
    ? <Label className="label-channel" text><img src="/static/img/text.png" />{channels.find(ch => ch.id === g.channel) && channels.find(ch => ch.id === g.channel).name}</Label>
    : <Select selected={0}
      type="text"
      add={[{id: null, name: 'Channel not selected'}]}
      set={api.set.channel} m />}
  <MessageEditor placeholder="Message" state={g.msg} set={api.set.msg} m></MessageEditor>
  <ObjectEdit label="Additional roles (if the user selects at least one role)" type="roles" data={g.addRoles} add={api.addRoles.add} del={api.addRoles.del} m />
  <ObjectEdit label="Reverse roles (if the user does not select any role)" type="roles" data={g.revRoles} add={api.revRoles.add} del={api.revRoles.del} m />
  <EditableList data={g.reacts.map((r, ii) => <MsgReact state={r} api={api.reacts.react(ii)} key={ii} />)}
    label="Reacts"
    limit={20}
    addLabel="Add react"
    add={api.reacts.add}
    delete={api.reacts.del}
    p={1} />
</>

export const reactionRoles = ({state, api}) => {
  const channels = useGuild.channels().list
  return <Category>
    <EditableList data={state.d.map((g, i) => <Msg g={g} api={api.msg(i)} key={g.id} {...{channels}} />)}
      addLabel="Add message"
      limit={2}
      add={api.add}
      delete={d => notify.question({description: 'Delete a message from a channel?', options: [['Yes', () => api.del(d, true)], ['No', () => api.del(d, false)], ['Cancel']]})}
      column p={1} />
  </Category>
}