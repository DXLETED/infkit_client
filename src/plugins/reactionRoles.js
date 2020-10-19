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

const generateId = arr => {
  var rnd = ''
  while (rnd.length < 8)
    rnd += Math.random().toString(36).substring(2)
  if (arr.includes(rnd))
    return generateId(arr)
  return rnd
}

export const reactionRoles = props => {
  const { state, api } = props
  const guild = useSelector(s => s.guild)
  const [saveVisible, setSaveVisible] = useState(false)
  if (!guild) return <></>
  const channels = useGuild.channels().list
  return (
    <>
      <EditableList data={state.d.map((g, i) => <>
          {g.channel
            ? <Label className="label-channel" text><img src="/static/img/text.png" />{channels.find(ch => ch.id === g.channel) && channels.find(ch => ch.id === g.channel).name}</Label>
            : <Select selected={0}
              type="text"
              add={[{id: null, name: 'Channel not selected'}]}
              set={n => api.setChannel(i, n)} m />}
            <TextArea spellCheck="false" placeholder="Message" value={state.d[i].msg} set={n => api.setMsg(i, n)} emoji></TextArea>
            {saveVisible && <div className="save"></div>}
            <EditableList data={state.d[i].reacts.map((r, ii) => <>
            <div className="emoji"><Emoji current={state.d[i].reacts[ii].emoji} set={n => api.setEmoji(i, ii, emojis.getUnicode(n.label))} disabled={state.d[i].reacts[ii].emoji} mr /></div>
            <ObjectEdit type="roles" data={state.d[i].reacts[ii].roles}
              add={n => api.addRole(i, ii, n)}
              delete={d => api.delRole(i, ii, d)} />
          </>)}
          addLabel="Add react"
          add={() => api.addReact(i)}
          delete={d => api.delReact(i, d)}
          p={1} />
        </>)}
        addLabel="Add message"
        limit={2}
        add={api.add}
        delete={d => notify.question({description: 'Delete a message from a channel?', options: [['Yes', () => api.del(d, true)], ['No', () => api.del(d, false)], ['Cancel']]})}
        column p={1} />
    </>
  )
}