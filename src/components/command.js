import React, { useState, memo } from 'react'
import cn from 'classnames'
import { Modal, ModalLabel } from './modal'
import { EdgedButton } from './button'
import { RolesList } from './rolesList'
import { Label } from './label'
import { ChannelsList } from './channelsList'
import { ObjectEdit } from './objectEdit'
import { Switch } from '../components/switch'
import { MultiSwitch } from '../components/multiSwitch'
import { l } from '../l'
import { useModal } from '../hooks/useModal'
import { Input } from './input'
import { Select } from './select'
import { useGuild } from '../hooks/useGuild'
import equal from 'fast-deep-equal'
import { isEqual } from 'lodash'
import { CustomTime } from './customTime'
import { config } from '../config'
import { Container } from './container'

export const Command = memo(props => {
  const { state, api } = props
  const [mState, mOpen, close] = useModal({fixed: true, fullScreen: true})
  const getRole = useGuild.roles().get
  const getChannel = useGuild.channels().get
  const getGroup = useGuild.groups().get
  const options = [
    state.aliases && state.aliases.length && ['aliases', state.aliases.length === 1 ? `${props.prefix}${state.aliases[0]}` : state.aliases.length],
    state.cd.v && ['cd', state.cd.v],
    ...['enabledRoles', 'disabledRoles'].map(el => state[el] && state[el].length ? state[el].length === 1 ? [el, getRole(state[el][0]).name] : [el, state[el].length] : null),
    ...['enabledChannels', 'disabledChannels'].map(el => state[el] && state[el].length ? state[el].length === 1 ? [el, getChannel(state[el][0]).name] : [el, state[el].length] : null),
    state.groups && state.groups.length ? state.groups.length === 1 ? ['groups', getGroup(state.groups[0]).name, 4] : ['groups', state.groups.length, 4] : ['nogroups', null]
  ].filter(Boolean)
  return (
    <div className={cn('command', {enabled: state.enabled})}>
      <div className="cmd-border"></div>
      <div className="cmd-d">
        <div className="cmd-label">{`${props.prefix}${props.label}`}</div>
        <div className="cmd-desc">{l('cmddesc_' + props.label)}</div>
      </div>
      <div className="cmd-options">
        {options.map(([k, o, priority = 2]) => <div className="cmd-state cd" key={k}><img src={`/static/img/cmd-options/${k}.png`} style={{opacity: o ? 1 : 0.5}} />{o && priority >= options.length && <div className="cmd-state__val">{o}</div>}</div>)}
        <Switch className="cmd-enabled" enabled={state.enabled} set={api.enabled.toggle}>{state.enabled ? 'Enabled' : 'Disabled'}</Switch>
        <div className="cmd-settings ml" onClick={mOpen}><img src="/static/img/settings.png" /></div>
        <Modal className="cmd-settings" s={mState} title={`${props.prefix}${props.label}`}>
          <ModalLabel type="Aliases" m>
            <ObjectEdit type="aliases" data={(state.aliases || []).map(a => ({name: a}))}
              add={api.aliases.add}
              delete={api.aliases.del} input />
          </ModalLabel>
          <ModalLabel type="Enabled roles" m>
            <ObjectEdit type="roles" data={state.eroles}
              add={api.eroles.add}
              delete={api.eroles.del}
              default="ALL by default" />
          </ModalLabel>
          <ModalLabel type="Disabled roles" m>
            <ObjectEdit type="roles" data={state.droles}
              add={api.droles.add}
              delete={api.droles.del} />
          </ModalLabel>
          <ModalLabel type="Enabled channels" m>
            <ObjectEdit type="channels" data={state.echannels}
              add={api.echannels.add}
              delete={api.echannels.del}
              default="ANY by default" />
          </ModalLabel>
          <ModalLabel type="Disabled channels" m>
            <ObjectEdit type="channels" data={state.dchannels}
              add={api.dchannels.add}
              delete={api.dchannels.del} />
          </ModalLabel>
          <ModalLabel type="Groups" m>
            <ObjectEdit type="groups" data={state.groups}
              add={api.groups.add}
              delete={api.groups.del} />
          </ModalLabel>
          {state.defaultAction && state.defaultAction.reason && <>
            <ModalLabel type="Action if reason isn't specified" m>
              <Container width={30} noflex vp1 hp1 column>
                <Select type="options"
                  selected={state.defaultAction.reason.a}
                  set={api.defaultAction.reason.set.a}
                  dropdown={l(`commands/moderation/${props.label}/default_action_reason`, true) || []}
                  options={config.get(`commands/moderation/${props.label}/default_action_reason`) || []}
                  m={state.defaultAction.reason.a === 'specific' || state.defaultAction.reason.a === 'reason'} />
                {state.defaultAction.reason.a === 'specific' && <Input value={state.defaultAction.reason.specific} set={api.defaultAction.reason.set.specific} b />}
                {state.defaultAction.reason.a === 'reason' && <Select type={`reason/${props.label}`}
                  selected={state.defaultAction.reason.reason}
                  add={[{id: null, reason: 'Reason not selected'}]}
                  set={api.defaultAction.reason.set.reason} />}
              </Container>
            </ModalLabel>
          </>}
          {state.defaultAction && state.defaultAction.time && <ModalLabel type="Action if time isn't specified" column={state.defaultAction.time.a === 'specific'} m>
            <Container width={state.defaultAction.time.a !== 'specific' && 30} noflex vp1 hp1 column>
              <Select type="options"
                selected={state.defaultAction.time.a}
                set={api.defaultAction.time.set.a}
                dropdown={l(`commands/moderation/${props.label}/default_action_time`, true) || []}
                options={config.get(`commands/moderation/${props.label}/default_action_time`) || []}
                m={state.defaultAction.time.a === 'specific' || state.defaultAction.time.a === 'reason'} />
              {state.defaultAction.time.a === 'specific' && <CustomTime value={state.defaultAction.time.specific} set={api.defaultAction.time.set.specific} defsize b />}
              {state.defaultAction.time.a === 'reason' && <Select type={`reason/${props.label}`}
                selected={state.defaultAction.time.reason}
                add={[{id: null, reason: 'Reason not selected'}]}
                set={api.defaultAction.time.set.reason} />}
            </Container>
          </ModalLabel>}
          {state.replyMsg && <ModalLabel type="Reply message" column m>
            <MultiSwitch options={['Disable', 'Default', 'Custom']} selected={{o: 1}} />
          </ModalLabel>}
          {/*<ModalLabel type="Cooldown" enabled={state.cd.enabled} toggle={api.cd.enabled} column m>
            <Select type="options" selected={state.cd.type} dropdown={['General', 'By channel', 'By user']} options={['general', 'channel', 'user']} m />
            <CustomTime label="Time" value={state.cd.v} set={api.cd.set} max={3600000} b defsize />
          </ModalLabel>*/}
          <ModalLabel type="Delete request message after" enabled={state.deleteAfter.req.enabled} toggle={api.deleteAfter.req.enabled} m>
            <div className="fill" />
            <CustomTime value={state.deleteAfter.req.v} set={api.deleteAfter.req.set} max={3600000} border defsize />
          </ModalLabel>
          <ModalLabel type="Delete response message after" enabled={state.deleteAfter.res.enabled} toggle={api.deleteAfter.res.enabled}>
            <div className="fill" />
            <CustomTime value={state.deleteAfter.res.v} set={api.deleteAfter.res.set} max={3600000} border defsize />
          </ModalLabel>
        </Modal>
      </div>
    </div>
  )
}, isEqual)

export const CommandsList = memo(props => {
  return Object.entries(props.cmds).filter(([cmdName]) => props.api[cmdName]).map(([commandName, command], i) =>
    <Command prefix={props.prefix} title={commandName} state={command} api={props.api[commandName]} key={i} label={commandName} />
  )
}, isEqual)