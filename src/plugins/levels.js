import React, { memo } from 'react'
import { CategoryName } from '../components/categoryName'
import { MultiSwitch } from '../components/multiSwitch'
import { Label } from '../components/label'
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

const Reward = memo(props => <Container hp1 vp1 vcenter>
  <Select selected={props.level} set={n => props.api.setLevel(props.i, n)} prefix="Level " dropdown={[...Array(101)].map((l, i) => i)} nm mr width={12.5} />
  <ObjectEdit
    type="roles"
    data={props.roles}
    add={n => props.api.addRole(props.i, n)}
    delete={d => props.api.delRole(props.i, d)} flex />
</Container>, isEqual)

export const Levels = memo(props => {
  const { state, api } = props
  return (
    <>
      <div className="xprates category">
        <CategoryName>XP Rates</CategoryName>
        <MultiSwitch label="XP per minute in the voice channel * Interlocutors"
          options={['DISABLE', '+ 0.5', '+ 0.75', '+ 1', '+ 2', '+ 5', '+ 10']}
          selected={state.voiceXPRate}
          set={api.voiceXPRate.set}
          custom m />
        <MultiSwitch label="XP per message"
          options={['DISABLE', '+ 1', '+ 2', '+ 5', '+ 10', '+ 20', '+ 50']}
          selected={state.textXPRate}
          set={api.textXPRate.set}
          custom m />
        <MultiSwitch label="Message timeout"
          type="time"
          options={['DISABLE', '2s', '5s', '10s', '30s', '1m']}
          selected={state.msgTimeout}
          set={api.msgTimeout.set}
          max={86400000} custom />
      </div>
      <div className="rewards-wr category">
        <CategoryName>Rewards</CategoryName>
        <Row elements={[
          <Options options={['Replace rewards', 'Stack previous rewards']} set={api.type.set} selected={state.type} label="Rewards type" />,
          <EditableList data={state.rewards.map((r, i) => <Reward level={r.level} roles={r.roles} api={api.rewards} i={i} key={i} />)}
            add={api.rewards.add}
            delete={api.rewards.delete}
            label="Level rewards"
            limit={10} />
        ]} />
      </div>
      <div className="settings category">
        <CategoryName>Settinigs</CategoryName>
        <Row elements={[
          <>
            <Options options={['Linear', 'Progressive']} set={api.setMode} selected={state.levelsMode} keys={['linear', 'progressive']} label="Levels mode" />
          </>,
          <>
            <ObjectEdit type="roles" data={state.disabledRoles}
              add={api.disabledRoles.add}
              delete={api.disabledRoles.del}
              label="NO XP roles" m />
            <ObjectEdit type="channels" data={state.disabledChannels}
              add={api.disabledChannels.add}
              delete={api.disabledChannels.del}
              label="NO XP channels" />
          </>
        ]} />
      </div>
      <div className="customization category">
        <CategoryName>Card customization</CategoryName>
        <Row elements={[
          {width: 3, el: <div className="card-wr">
            <div className="card">
              <Card s={{colors: state.card.colors}} />
            </div>
          </div>},
          <>
            <ColorPicker label="Text #1" c={state.card.colors.text1} set={api.card.colors.set.text1} reset="#FFFFFF" m />
            <ColorPicker label="Text #2" c={state.card.colors.text2} set={api.card.colors.set.text2} reset="#939393" m />
            <ColorPicker label="Text #3" c={state.card.colors.text3} set={api.card.colors.set.text3} reset="#FFFFFF" m />
            <ColorPicker label="Text #4" c={state.card.colors.text4} set={api.card.colors.set.text4} reset="#939393" />
          </>,
          <>
            <ColorPicker label="Background" c={state.card.colors.bg} set={api.card.colors.set.bg} reset="#202124" m />
            <ColorPicker label="Name background" c={state.card.colors.bgname} set={api.card.colors.set.bgname} reset="#141517" m />
            <ColorPicker label="XP" c={state.card.colors.xp} set={api.card.colors.set.xp} reset="#FFFFFF" m />
            <ColorPicker label="XP background" c={state.card.colors.bgxp} set={api.card.colors.set.bgxp} reset="#535353" />
          </>
        ]} />
      </div>
      <div className="commands-wr category">
        <CategoryName>Commands</CategoryName>
        <div className="commands">
          <CommandsList cmds={state.commands} api={api.cmds} prefix={props.prefix} />
        </div>
      </div>
    </>
  )
})