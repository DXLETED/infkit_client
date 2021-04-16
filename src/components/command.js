import React, { memo } from 'react'
import st from './Command.sass'
import cn from 'classnames'
import { Modal, ModalLabel } from './modal'
import { ObjectEdit } from './objectEdit'
import { MultiSwitch } from '../components/multiSwitch'
import { l } from '../l'
import { useModal } from '../hooks/useModal'
import { Input } from './input'
import { Select } from './select'
import { isEqual } from 'lodash'
import { CustomTime } from './customTime'
import { config } from '../config'
import { Container } from './container'
import { Enabled } from './enabled'
import { Category } from './Category'
import { useLayout } from '../hooks/layout.hook'
import { PermissionsEditor } from './PermissionsEditor'

const OptionState = ({val, active, k}) =>
  <div className={st.state}>
    <img src={`/static/img/cmd-options/${k}.png`} style={{opacity: (val || active) ? 1 : 0.5}} />
    {val ? <div className={st.val}>{val}</div> : ''}
  </div>

export const Command = memo(props => {
  const { state, api } = props
  const [mState, mOpen] = useModal({fixed: true, fullScreen: true})
  return (
    <div className={cn(st.command, {enabled: state.enabled, [st.m]: props.m})}>
      <div className={st.border}></div>
      <div className={st.d}>
        <div className={st.label}>{`${props.prefix}${props.label}`}</div>
        <div className={st.desc}>{l('cmddesc_' + props.label)}</div>
      </div>
      <div className={st.info}>
        <div className={st.options}>
          {state.cd.enabled && state.cd.v ? <OptionState k="cd" active /> : ''}
          {state.aliases?.length && <OptionState val={state.aliases.length === 1 ? `${props.prefix}${state.aliases[0]}` : state.aliases.length} k="aliases" />}
          {state.permissions.access.private
            ? state.permissions.access.allow?.length
              ? <OptionState val={state.permissions.access.allow.length} k="eroles" />
              : <OptionState val="Admin only" k="adminOnly" />
            : state.permissions.access.deny?.length
              ? <OptionState val={state.permissions.access.deny.length} k="droles" />
              : <OptionState k="noroles" />}
          {state.permissions.channels.private
            ? state.permissions.channels.allow?.length
              ? <OptionState val={state.permissions.channels.allow.length} k="echannels" />
              : <OptionState k="nochannels" />
            : state.permissions.channels.deny?.length
              ? <OptionState val={state.permissions.channels.deny.length} k="dchannels" />
              : <OptionState k="nochannels" />}
          <div className={st.optionsHover} onClick={mOpen}><img src="/static/img/settings.png" /></div>
        </div>
        <Enabled state={state.enabled} set={api.enabled.toggle} />
      </div>
      <Modal className={st.settings} s={mState} title={`${props.prefix}${props.label}`} column>
        <PermissionsEditor state={state.permissions} set={api.set.permissions} m />
        <ModalLabel type="Aliases" m>
          <ObjectEdit type="aliases" data={state.aliases}
            add={api.aliases.add}
            delete={api.aliases.del} right input />
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
        {state.vote && <ModalLabel type="Vote to skip" enabled={state.vote.enabled} toggle={api.vote.enabled} m>
          <ObjectEdit type="roles" data={state.vote.roles}
            add={api.vote.roles.add}
            delete={api.vote.roles.del}
            default="ALL by default" right flex />
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
  )
}, isEqual)

export const CommandsList = memo(({cmds, api, prefix}) => {
  const list = Object.entries(cmds).filter(([cmdName]) => api[cmdName])
  const layout = useLayout()
  return <Category title="Commands">
    <div className={st.commands}>
      {list.map(([commandName, command], i) =>
        <Command prefix={prefix} title={commandName} state={command} api={api[commandName]} m={i < list.length - (layout.ap2 ? 1 : 2)} key={i} label={commandName} />
      )}
    </div>
  </Category>
}, isEqual)