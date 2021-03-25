import React from 'react'
import { Category } from '../components/Category'
import { EditableList } from '../components/editableList'
import { Label } from '../components/label'
import { MessageEditor } from '../components/MessageEditor'
import { Select } from '../components/select'
import { TextArea } from '../components/textarea'
import { useGuild } from '../hooks/useGuild'

const Msg = ({m, api}) => {
  const channels = useGuild.channels().list
  console.log(api)
  return <>
    {m.channel
      ? <Label className="label-channel" text><img src="/static/img/text.png" />{channels.find(ch => ch.id === m.channel) && channels.find(ch => ch.id === m.channel).name}</Label>
      : <Select selected={0}
        type="text"
        add={[{id: null, name: 'Channel not selected'}]}
        set={api.set.channel} m />}
    <MessageEditor state={m.msg} set={api.set.msg} />
  </>
}

export const Embeds = ({state, api}) => <>
  <Category>
    <EditableList label="Messages" data={state.d.map((m, i) => <Msg m={m} api={api.msg(i)} />)}
    add={api.create}
    delete={api.del}
    limit={5} p={1} column />
  </Category>
</>