import React, { useState, useRef } from 'react'
import cn from 'classnames'
import emojiList from 'discord-emoji'
import { Modal } from './modal'
import { Label } from './label'
import { Scroll } from './scroll'
import { useModal } from '../hooks/useModal'
import { emojis } from './emojis'
import { ExpansionPanel } from './expansionPanel'
import { memo } from 'react'
import { diff } from 'deep-diff'
import { useMemo } from 'react'
import { Input } from './input'

const CategoryEmoji = props => {
  const scale = 28 / emojis.size
  const startFrom = emojis.list[props.cat] ? emojis.list[props.cat].startFrom : 0
  return emojis.list[props.cat] 
    ? emojis.list[props.cat].list.map((e, i) =>
      <div className="category-emoji-el">
        <div
          style={{
            backgroundSize: `${emojis.width * scale}px ${emojis.height * scale}px`,
            backgroundPositionX: (i + startFrom) % emojis.row * -emojis.size * scale,
            backgroundPositionY: Math.floor((i + startFrom) / emojis.row) * -emojis.size * scale
          }}
          onClick={() => props.set({label: e.split(' ')[0], x: i % emojis.row, y: Math.floor(i / emojis.row)})} />
      </div>)
    : ''
}

const EmojiList = memo(({open, set, us}) => <>
  {open && <>
    <Input input={n => console.log(n)} placeholder="Search" b m />
    <ExpansionPanel header="People" dropdown={<CategoryEmoji cat="people" set={set} />} open m></ExpansionPanel>
    <ExpansionPanel header="Nature" dropdown={<CategoryEmoji cat="nature" set={set} />} open m></ExpansionPanel>
    <ExpansionPanel header="Food" dropdown={<CategoryEmoji cat="food" set={set} />} open m></ExpansionPanel>
    <ExpansionPanel header="Activity" dropdown={<CategoryEmoji cat="activity" set={set} />} open m></ExpansionPanel>
    <ExpansionPanel header="Travel" dropdown={<CategoryEmoji cat="travel" set={set} />} open m></ExpansionPanel>
    <ExpansionPanel header="Objects" dropdown={<CategoryEmoji cat="objects" set={set} />} open m></ExpansionPanel>
    <ExpansionPanel header="Symbols" dropdown={<CategoryEmoji cat="symbols" set={set} />} open m></ExpansionPanel>
    <ExpansionPanel header="Flags" dropdown={<CategoryEmoji cat="flags" set={set} />} open m></ExpansionPanel>
  </>}
</>, (o, n) => o.open === n.open && o.us === n.us && o.set === n.set)

export const Emoji = props => {
  const [mState, mOpen, close] = useModal({width: 50})
  const set = useMemo(() => e => {
    props.set(e)
    close()
  }, [])
  const scale = 28 / emojis.size
  return (
    <div className={cn('emoji', props.className, {'emoji-disabled': props.disabled, selected: props.current, mr: props.mr})}>
      <div className="emoji-sel" onClick={mOpen} style={props.current ? (() => {
        const { x, y } = emojis.get(props.current) || {}
        return {
          backgroundSize: `${emojis.width * scale}px ${emojis.height * scale}px`,
          backgroundPositionX: x * emojis.size * scale * -1,
          backgroundPositionY: y * emojis.size * scale * -1
        }
      })() : (() => {
        const [ x, y ] = [19, 1]
        return {
          backgroundSize: `${emojis.width * scale}px ${emojis.height * scale}px`,
          backgroundPositionX: x * emojis.size * scale * -1,
          backgroundPositionY: y * emojis.size * scale * -1
        }
      })()} />
      {!props.disabled &&
        <Modal className="emoji" s={mState}>
          <EmojiList open={mState.open} set={set} us={{}} />
        </Modal>}
    </div>
  )
}