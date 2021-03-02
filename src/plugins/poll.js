import React from 'react'
import { MultiSwitch } from '../components/multiSwitch'
import { CommandsList } from '../components/command'
import { Category } from '../components/Category'

export const Poll = props => {
  const { state, api } = props
  return <>
    <Category title="Poll">
      <MultiSwitch label="Default duration" type="time" options={['5s', '20s', '1m', '2m', '5m']} selected={props.state.duration} set={api.setDuration} custom />
    </Category>
    <CommandsList cmds={state.commands} api={api.cmds} prefix={props.prefix} />
  </>
}