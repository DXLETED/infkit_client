import React, { memo } from 'react'
import { CommandsList } from '../components/command'
import { Options } from '../components/options'
import { EditableList } from '../components/editableList'
import { Select } from '../components/select'
import { ObjectEdit } from '../components/objectEdit'
import { isEqual } from 'lodash'
import { Row } from '../components/row'
import { Container } from '../components/container'
import { ColorPicker } from '../components/colorPicker'
import { Card } from '../components/card'
import { Category } from '../components/Category'
import { CustomTime } from '../components/customTime'
import { Slider } from '../components/slider'
import { Switch } from '../components/switch'
import { colors } from '../components/colorlist'
import { MLabel } from '../components/mlabel'
import { CardCustomization } from '../components/plugins/CardCustomization'
import { Row2 } from '../components/Row2'
import { Button } from '../components/button'
import { notify } from '../components/notify'
import { PermissionsEditor } from '../components/PermissionsEditor'
import { useServerTime } from '../hooks/servertime.hook'
import { useSelector } from 'react-redux'
import moment from 'moment'
import cn from 'classnames'

const Reward = memo(props => <Container hp1 vp1 vcenter>
  <Select selected={props.level} set={n => props.api.setLevel(props.i, n)} prefix="Level " dropdown={[...Array(101)].map((l, i) => i)} nm mr width={12.5} />
  <ObjectEdit
    type="roles"
    data={props.roles}
    add={n => props.api.addRole(props.i, n)}
    delete={d => props.api.delRole(props.i, d)} flex />
</Container>, isEqual)

const UpdateRewards = ({api}) => {
  const time = useServerTime(1000)
  const timeout = useSelector(s => s.guild.state.timeouts.recalculateRewards)
  return <Button
    src="/static/img/plugins/automod.png"
    label={`Recalculate rewards${timeout >= time ? ` (${moment(timeout).fromNow()})` : ''}`}
    className={cn({disabled: timeout >= time})}
    onClick={() => notify.yesno({fs: true, title: 'Recalculate rewards', text: 'You will not be able to repeat this action for a while'}, 10000, [() => api.updAll()])} />
}

export const Levels = memo(({state, api, layout, prefix}) => <>
  <Category title="XP Rates">
    <Row2 els={[
      [<>
        <Slider label={`XP per minute in the voice channel${state.voiceXPAdaptivity ? ' * Interlocutors' : ''}`} value={state.voiceXPRate} set={api.set.voiceXPRate} keyPoints={40} modifier={40} min={0} max={40} />
        <Slider label="XP per message" value={state.textXPRate} set={api.set.textXPRate} keyPoints={50} modifier={100} min={0} max={100} />
      </>, {flex: 3}],
      !layout.ap2 && [<Container style={{width: 2, background: colors.grey}} noflex />, {flex: 0, row: true, style: {marginRight: 20, marginLeft: 20}}],
      [<>
        <MLabel d="Voice XP adaptivity" />
        <Switch enabled={state.voiceXPAdaptivity} set={api.set.voiceXPAdaptivity} p m>XP depends on the number of interlocutors</Switch>
        <CustomTime label="Message timeout" value={state.msgTimeout} set={api.set.msgTimeout} max={86400000} b defsize />
      </>, {flex: 2}]
    ]} column={layout.ap2} c={{marginBottom: 20}} />
  </Category>
  <Category title="Rewards">
    <Row elements={[
      <>
        <Options options={['Replace rewards', 'Stack previous rewards']} set={api.type.set} selected={state.type} label="Rewards type" />
        <UpdateRewards api={api} />
      </>,
      <EditableList data={state.rewards.map((r, i) => <Reward level={r.level} roles={r.roles} api={api.rewards} i={i} key={i} />)}
        add={api.rewards.add}
        delete={api.rewards.delete}
        label="Level rewards"
        limit={10} />
    ]} column={layout.ap2} />
  </Category>
  <Category title="Settings">
    <Row2 els={[
      <Options options={['Linear', 'Progressive']} set={api.setMode} selected={state.levelsMode} keys={['linear', 'progressive']} label="Levels mode" />,
      <PermissionsEditor label="Getting hp"
        state={state.gettingXP}
        set={api.set.gettingXP} />
    ]} column={layout.ap2} />
  </Category>
  <Category title="Card customization">
    <CardCustomization state={state.card} api={api.card} />
  </Category>
  <CommandsList cmds={state.commands} api={api.cmds} prefix={prefix} />
</>)