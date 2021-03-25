import React from 'react'
import { CommandsList } from '../components/command'
import { EditableList } from '../components/editableList'
import { Input } from '../components/input'
import { CustomTime } from '../components/customTime'
import { Row } from '../components/row'
import { Category } from '../components/Category'

export const Moderation = ({state, api, layout, prefix}) => <>
  <CommandsList cmds={state.commands} api={api.cmds} prefix={prefix} />
  <Category title="Reasons">
    <Row elements={[
      <EditableList label="Mute" data={state.reasons.mute.map((r, i) => <>
        <Input label="Reason" value={r.reason} set={n => api.reasons.mute.setReason(i, n)} b m />
        <CustomTime label="Text mute time" value={r.time.text} set={n => api.reasons.mute.setTimeText(i, n)} b m defsize max={2419200000} />
        <CustomTime label="Voice mute time" value={r.time.voice} set={n => api.reasons.mute.setTimeVoice(i, n)} b m defsize max={2419200000} />
      </>)}
      add={api.reasons.mute.add}
      delete={api.reasons.mute.del} m2 column p={1} limit={5} />,
      <>
        <EditableList label="Kick" data={state.reasons.kick.map((r, i) => <>
            <Input label="Reason" value={r.reason} set={n => api.reasons.kick.setReason(i, n)} b m />
          </>)}
          add={api.reasons.kick.add}
          delete={api.reasons.kick.del} m2 column p={1} limit={5} />
        <EditableList label="Ban" data={state.reasons.ban.map((r, i) => <>
            <Input label="Reason" value={r.reason} set={n => api.reasons.ban.setReason(i, n)} b m />
            <CustomTime label="Ban time" value={r.time} set={n => api.reasons.ban.setBanTime(i, n)} b m defsize max={31449600000} />
          </>)}
          add={api.reasons.ban.add}
          delete={api.reasons.ban.del} m2 column p={1} limit={5} />
      </>
    ]} column={layout.ap2} />
  </Category>
</>