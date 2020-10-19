import React from 'react'
import { Label } from '../components/label'
import { ObjectEdit } from '../components/objectEdit'
import { useSelector } from 'react-redux'
import { Select } from '../components/select'
import { useGuild } from '../hooks/useGuild'
import { TextArea } from '../components/textarea'
import { Switch } from '../components/switch'

export const Welcome = props => {
  const { state, api } = props
  return (
    <>
      <Switch enabled={state.toChannel.enabled} set={api.toChannel.toggle.enabled} m>Send message to the channel</Switch>
      {state.toChannel.enabled && <>
        <Select type="text" add={[{id: null, name: 'Channel select'}]} selected={state.toChannel.enabled ? state.toChannel.channel : null}
          set={api.toChannel.set.channel} m />
        <TextArea placeholder="Message" value={state.toChannel.msg.content} set={api.toChannel.set.msg}></TextArea>
      </>}
      <Switch enabled={state.private.enabled} set={api.private.toggle.enabled} m>Send private message</Switch>
      {state.private.enabled && <TextArea placeholder="Private message" value={state.private.msg.content} set={api.private.set.msg}></TextArea>}
      <ObjectEdit label="Roles to give" type="roles" data={state.roles}
        add={api.roles.add}
        delete={api.roles.del} m />
    </>
  )
}