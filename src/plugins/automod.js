import React, { memo } from 'react'
import { Category } from '../components/Category'
import { CategoryName } from '../components/categoryName'
import { CustomTime } from '../components/customTime'
import { EditableList } from '../components/editableList'
import { Enabled } from '../components/enabled'
import { ExpansionPanel } from '../components/expansionPanel'
import { Input } from '../components/input'
import { Label } from '../components/label'
import { MultiSwitch } from '../components/multiSwitch'
import { ObjectEdit } from '../components/objectEdit'
import { Row } from '../components/row'
import { Select } from '../components/select'
import { Slider } from '../components/slider'
import { Switch } from '../components/switch'

const AutomodItem = memo(({state, label, api, trigger, layout}) => <ExpansionPanel header={label} className="filters__item" dropdown={<Row elements={[
  <>
    {trigger && <>
      <Label>Trigger</Label>
      {trigger}
    </>}
    <Label mt>Member selection</Label>
    <ObjectEdit label="Disabled roles" type="roles" data={state.droles} add={api.droles.add} delete={api.droles.del} m />
    <ObjectEdit label="Disabled channels" type="channels" data={state.dchannels} add={api.dchannels.add} delete={api.dchannels.del} m />
  </>,
  <>
  <Label>Action</Label>
    <MultiSwitch label="Warns" selected={{o: state.warns}} set={n => api.setWarns(n.o)} options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} m />
    <CustomTime label="Text mute time" value={state.muteTime.text} set={api.setMuteTimeText} b m defsize />
    <CustomTime label="Voice mute time" value={state.muteTime.voice} set={api.setMuteTimeVoice} b m defsize />
    <Switch enabled={state.delMsg} set={api.setDelMsg} p>Delete message</Switch>
  </>
]} margin={2} column={layout.ap2} />} r={<Enabled state={state.enabled} set={api.enabled} />} disabled={!state.enabled} column m />)

export const Automod = ({state, api, layout}) => <>
  <Category title="Filters">
    <AutomodItem label="Spam" state={state.filters.spam} api={api.filters.spam} trigger={
      <>
        <Row elements={[
          <Input value={state.filters.spam.messages} set={api.filters.spam.setMessages} type="number" min={2} b />,
          {width: null, el: <Label nm>messages per</Label>},
          {width: 2, el: <CustomTime value={state.filters.spam.reset} set={api.filters.spam.setResetTime} min={10000} b defsize />}
        ]} aic m />
      </>
    } {...{layout}} />
    <AutomodItem label="Repeated messages" state={state.filters.repeatedMessages} api={api.filters.repeatedMessages} trigger={
      <>
        <Row elements={[
          <Input value={state.filters.repeatedMessages.messages} set={api.filters.repeatedMessages.setMessages} type="number" min={2} b />,
          {width: null, el: <Label nm>repeated messages per</Label>},
          {width: 2, el: <CustomTime value={state.filters.repeatedMessages.reset} set={api.filters.repeatedMessages.setResetTime} min={10000} b defsize />}
        ]} aic m />
      </>
    } {...{layout}} />
    <AutomodItem label="Caps" state={state.filters.caps} api={api.filters.caps} trigger={
      <>
        <Slider label="CAPS %" value={state.filters.caps.threshold} set={api.filters.caps.setThreshold} keyPoints={10} min={0.5} max={1} m />
        <Input value={state.filters.caps.minLength} set={api.filters.caps.setMinLength} label="Min message length" type="number" min={10} max={100} b m />
      </>
    } {...{layout}} />
    <AutomodItem label="Emoji spam" state={state.filters.emoji} api={api.filters.emoji} trigger={
      <>
        <Slider label="EMOJI %" value={state.filters.emoji.threshold} set={api.filters.emoji.setThreshold} keyPoints={10} min={0.5} max={1} m />
        <Input value={state.filters.emoji.minLength} set={api.filters.emoji.setMinLength} label="Min message length" type="number" min={10} max={100} b m />
      </>
    } {...{layout}} />
    <AutomodItem label="Links" state={state.filters.links} api={api.filters.links} trigger={
      <>
        <ObjectEdit label="Allowed domains" type="aliases" data={state.filters.links.allowedDomains}
          add={api.filters.links.allowedDomains.add}
          delete={api.filters.links.allowedDomains.del} input m />
      </>
    } {...{layout}} />
    <AutomodItem label="Zalgo" state={state.filters.zalgo} api={api.filters.zalgo} trigger={
      <>
        <Slider label="Threshold" value={state.filters.zalgo.threshold} set={api.filters.zalgo.setThreshold} keyPoints={10} min={0.5} max={1} m />
      </>
    } {...{layout}} />
  </Category>
  <Category title="Automated actions">
    <EditableList data={state.autoActions.map((a, i) => <>
      <Row elements={[
        <>
          <Label>Trigger</Label>
          <Row elements={[
            <Select selected={a.warns} set={n => api.autoActions.setWarns(i, n)} ending={a.warns === 1 ? ' warning' : ' warnings'} dropdown={[...Array(101)].map((_, i) => i)} nm />,
            {width: 0, jcc: true, el: <Label nm>per</Label>},
            {width: 2, el: <CustomTime value={a.reset} set={n => api.autoActions.setResetTime(i, n)} b defsize />}
          ]} column={layout.ap3} jcc />
        </>,
        <>
          <Label>Action</Label>
          <Select
            type="options"
            selected={a.action}
            options={['none', 'mute', 'kick', 'ban']}
            dropdown={['None', 'Mute', 'Kick', 'Ban']}
            set={n => api.autoActions.setAction(i, n)} m />
          {a.action === 'mute' && a.muteTime && <>
            <CustomTime label="Text mute time" value={a.muteTime.text} set={n => api.autoActions.setMuteTime.text(i, n)} b m defsize />
            <CustomTime label="Voice mute time" value={a.muteTime.voice} set={n => api.autoActions.setMuteTime.voice(i, n)} b m defsize />
          </>}
          {a.action === 'ban' && a.ban && <Select label="Ban type"
            type="options"
            selected={a.ban.type}
            options={['permanently', 'time', 'reason']}
            dropdown={['Permanently', 'Time selection', 'By reason']}
            set={n => api.autoActions.setBanType(i, n)} m={a.ban.type === 'time' || a.ban.type === 'reason'} />}
          {a.ban && a.ban.type === 'time' && <CustomTime label="Ban time"
            value={0}
            set={n => api.autoActions.setBanTime(i, n)} defsize b />}
          {a.ban && a.ban.type === 'reason' && <Select label="Ban reason"
            type="reason/ban"
            selected={null}
            set={n => api.autoActions.setBanReason(i, n)} />}
        </>
      ]} margin={2} column={layout.ap2} />
    </>)}
    add={api.autoActions.create}
    delete={api.autoActions.del} column p={1} limit={5} />
  </Category>
</>