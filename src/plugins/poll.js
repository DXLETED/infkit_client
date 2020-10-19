import React from 'react'
import { MultiSwitch } from '../components/multiSwitch'
import { Label } from '../components/label'
import { CategoryName } from '../components/categoryName'
import { Command, CommandsList } from '../components/command'

export const Poll = props => {
  const { state, api } = props
  return (
    <>
      <div className="commands-wr category">
        <CategoryName>Settings</CategoryName>
        <MultiSwitch label="Default duration" type="time" options={['5s', '20s', '1m', '2m', '5m']} selected={props.state.duration} set={api.setDuration} custom />
      </div>
      <div className="commands-wr category">
        <CategoryName>Commands</CategoryName>
        <div className="commands">
          <CommandsList cmds={state.commands} api={api.cmds} prefix={props.prefix} />
        </div>
      </div>
    </>
  )
}