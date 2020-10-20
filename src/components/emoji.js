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
import { useSettings } from '../hooks/settings.hook'

const CategoryEmoji = props => {
  const scale = 28 / emojis.size
  const startFrom = emojis.list[props.cat] ? emojis.list[props.cat].startFrom : 0
  const [open, setOpen] = useSettings('emoji_category_' + props.cat, true, {options: [true, false]})
  return <ExpansionPanel header={props.header} dropdown={emojis.list[props.cat]
    ? emojis.list[props.cat].list.map((e, i) =>
      <div className="category-emoji-el" key={e}>
        <div
          style={{
            backgroundSize: `${emojis.width * scale}px ${emojis.height * scale}px`,
            backgroundPositionX: (i + startFrom) % emojis.row * -emojis.size * scale,
            backgroundPositionY: Math.floor((i + startFrom) / emojis.row) * -emojis.size * scale
          }}
          onClick={() => props.set({label: e.split(' ')[0], x: i % emojis.row, y: Math.floor(i / emojis.row)})} />
      </div>)
    : ''} onchange={setOpen} open={open} m></ExpansionPanel>
}

const EmojiList = memo(({open, set, us}) => {
  const [search, setSearch] = useState('')
  const scale = 28 / emojis.size
  return <>
    {open && <>
      <Input input={setSearch} placeholder="Search" b m />
      {search
      ? <div className="emoji-search-list">{
        emojis.all().map((e, i) => [e, i]).filter(e => e[0].includes(search)).map(([e, i]) =>
          <div className="emoji-el" key={e}>
            <div
              style={{
                backgroundSize: `${emojis.width * scale}px ${emojis.height * scale}px`,
                backgroundPositionX: i % emojis.row * -emojis.size * scale,
                backgroundPositionY: Math.floor(i / emojis.row) * -emojis.size * scale
              }}
              onClick={() => set({label: e.split(' ')[0], x: i % emojis.row, y: Math.floor(i / emojis.row)})} />
          </div>)}
        </div>
      : <>
        <CategoryEmoji header="People" cat="people" set={set} />
        <CategoryEmoji header="Nature" cat="nature" set={set} />
        <CategoryEmoji header="Food" cat="food" set={set} />
        <CategoryEmoji header="Activity" cat="activity" set={set} />
        <CategoryEmoji header="Travel" cat="travel" set={set} />
        <CategoryEmoji header="Objects" cat="objects" set={set} />
        <CategoryEmoji header="Symbols" cat="symbols" set={set} />
        <CategoryEmoji header="Flags" cat="flags" set={set} />
      </>}
    </>}
  </>
}, (o, n) => o.open === n.open && o.us === n.us && o.set === n.set)

export const Emoji = props => {
  const [mState, mOpen, close] = useModal({width: 46.5})
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