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
import { Enabled } from './enabled'

import st from './Command.sass'
import { Category } from './Category'

export const Command = memo(props => {
  const { state, api } = props
  const [mState, mOpen] = useModal({fixed: true, fullScreen: true})
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
    <div className={cn(st.command, {enabled: state.enabled, [st.m]: props.m})}>
      <div className={st.border}></div>
      <div className={st.d}>
        <div className={st.label}>{`${props.prefix}${props.label}`}</div>
        <div className={st.desc}>{l('cmddesc_' + props.label)}</div>
      </div>
      <div className={st.options}>
        {options.map(([k, o, priority = 2]) => <div className={st.state} onClick={mOpen} key={k}><img src={`/static/img/cmd-options/${k}.png`} style={{opacity: o ? 1 : 0.5}} />{o && priority >= options.length && <div className={st.val}>{o}</div>}</div>)}
        <Enabled state={state.enabled} set={api.enabled.toggle} />
        <Modal className={st.settings} s={mState} title={`${props.prefix}${props.label}`} column>
          <ModalLabel type="Aliases" m>
            <ObjectEdit type="aliases" data={state.aliases}
              add={api.aliases.add}
              delete={api.aliases.del} right input />
          </ModalLabel>
          <ModalLabel type="Enabled roles" m>
            <ObjectEdit type="roles" data={state.eroles}
              add={api.eroles.add}
              delete={api.eroles.del}
              default="ALL by default" right flex />
          </ModalLabel>
          <ModalLabel type="Disabled roles" disabled={!!state.eroles} m>
            <ObjectEdit type="roles" data={state.droles}
              add={api.droles.add}
              delete={api.droles.del} right flex />
          </ModalLabel>
          <ModalLabel type="Enabled channels" m>
            <ObjectEdit type="channels" data={state.echannels}
              add={api.echannels.add}
              delete={api.echannels.del}
              default="ANY by default" right flex />
          </ModalLabel>
          <ModalLabel type="Disabled channels" disabled={!!state.echannels} m>
            <ObjectEdit type="channels" data={state.dchannels}
              add={api.dchannels.add}
              delete={api.dchannels.del} right flex />
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

export const CommandsList = memo(({cmds, api, prefix}) => {
  const list = Object.entries(cmds).filter(([cmdName]) => api[cmdName])
  return <Category title="Commands">
    <div className={st.commands}>
      {list.map(([commandName, command], i) =>
        <Command prefix={prefix} title={commandName} state={command} api={api[commandName]} m={i < list.length - 2} key={i} label={commandName} />
      )}
    </div>
  </Category>
}, isEqual)