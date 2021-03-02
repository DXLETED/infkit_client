import React from 'react'
import { CommandsList } from '../components/command'

import { Category } from '../components/Category'
import { Player } from '../components/plugins/Player'

export const Music = props => {
  const { state, api } = props
  return (
    <>
      <Category title="Player">
        <Player {...{state, api}} />
      </Category>
      <CommandsList cmds={state.commands} api={api.cmds} prefix={props.prefix} />
    </>
  )
}