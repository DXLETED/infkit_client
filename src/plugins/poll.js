import React from 'react'
import { MultiSwitch } from '../components/multiSwitch'
import { CommandsList } from '../components/command'
import { Category } from '../components/Category'

export const Poll = ({state, api, prefix}) => <>
  <Category title="Settings">
    <MultiSwitch label="Default duration" type="time" options={['5s', '20s', '1m', '2m', '5m']} selected={state.duration} set={api.setDuration} custom />
  </Category>
  <CommandsList cmds={state.commands} api={api.cmds} prefix={prefix} />
</>