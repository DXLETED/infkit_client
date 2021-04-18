import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { Component } from './Component'
import { TextArea } from './textarea'
import st from './MessageEditor.sass'
import { MessageVisualizer } from './MessageVisualizer'
import { EmojiBtn } from './emoji'
import { EmbedEditor } from './EmbedEditor'
import { useSettings } from '../hooks/settings.hook'
import { useLayout } from '../hooks/layout.hook'
import { customUpdate } from '../api'
import { cloneDeep, isEqual } from 'lodash'
import { notify } from './notify'
import Color from 'color'
import { useStateRef } from '../hooks/stateref.hook'

export const msgApi = (u => ({
  set: {
    content: n => u(msg => msg.content = n)
  },
  embed: {
    author: {
      set: {
        icon_uri: n => u(msg => (msg.embed.author ??= {}).icon_uri = n),
        name: n => u(msg => (msg.embed.author ??= {}).name = n)
      }
    },
    fields: {
      add: () => u(msg => (msg.embed.fields ??= []).push({name: '', value: ''})),
      field: i => ({
        set: {
          name: n => u(msg => msg.embed.fields[i].name = n),
          value: n => u(msg => msg.embed.fields[i].value = n)
        },
        del: () => u(msg => msg.embed.fields = msg.embed.fields.filter((_, d) => d !== i))
      })
    },
    footer: {
      set: {
        icon_uri: n => u(msg => (msg.embed.footer ??= {}).icon_uri = n),
        text: n => u(msg => (msg.embed.footer ??= {}).text = n)
      }
    },
    set: {
      title: n => u(msg => msg.embed.title = n),
      url: n => u(msg => msg.embed.url = n),
      description: n => u(msg => msg.embed.description = n),
      color: n => u(msg => n ? (msg.embed.color = Color(n).rgbNumber()) : delete msg.embed.color),
      image: n => u(msg => msg.embed.image = {url: n}),
      thumbnail: n => u(msg => msg.embed.thumbnail = {url: n})
    },
    remove: () => u(msg => delete msg.embed)
  }
}))

export const MessageEditor = ({state, set, ...props}) => {
  const [msg, setMsg, msgRef] = useStateRef(cloneDeep(state)),
        initial = useRef(state),
        mapi = msgApi(customUpdate(setMsg))
  const [isEditing, setIsEditing] = useState(false)
  const [length, setLength] = useState(!state.embed && state.content)
  const [previewVisible, setPreviewVisible] = useSettings('preview', false)
  const layout = useLayout()
  const controls = useRef()
  useEffect(() => { initial.current = state }, [state])
  useEffect(() => () =>
    !isEqual(msgRef.current, initial.current)
      && notify.yesno({fs: true, title: 'Save changes in the message?', text: <MessageVisualizer msg={msgRef.current} w100 bot />}, null, [() => set(msgRef.current)])
  , [])
  return <Component cln={cn(st.messageEditor)} {...props}>
    <div className={st.messageEditorInner}>
      <div className={st.editor}>
        {msg.embed
        ? <>
          <TextArea value={msg.content} onContentUpdate={mapi.set.content} emoji nativeControls m />
          <EmbedEditor embed={msg.embed} api={mapi.embed} />
        </>
        : <TextArea value={msg.content} onContentUpdate={mapi.set.content} onLengthUpdate={setLength} onEditingUpdate={setIsEditing} getControls={c => controls.current = c} h100 emoji />}
      </div>
      {previewVisible && <MessageVisualizer className={st.messageVisualizer} msg={msg} w100={layout.ap2} maxwidth bot />}
    </div>
    <div className={cn(st.previewButton2, {[st.enabled]: previewVisible})} onClick={() => setPreviewVisible(!previewVisible)}>
      {previewVisible ? <img src="/static/img/arrow/top.png" /> : <img src="/static/img/arrow/bottom.png" />}Preview
    </div>
    <div className={cn(st.controls)}>
      <div className={st.controls1}>
        {!msg.embed && <>
          <EmojiBtn className={st.emoji} set={e => controls.current?.insert(e.label)}><img src="/static/img/emojiBtn.png" /> Emoji</EmojiBtn>
          <div className={cn(st.limit, {[st.exceeded]: length > 2000})}>
            {length} / 2000
          </div>
        </>}
        <div className={st.cancel} onClick={() => msg.embed ? setMsg(state) : controls.current?.cancel}><img src="/static/img/delete.png" />Cancel</div>
        <div className={st.save} onClick={() => {
          set(msg)
          setIsEditing(false)
        }}><img src="/static/img/done.png" />Save</div>
        {!msg.embed && <div className={st.addEmbed} onClick={() => setMsg({...msg, embed: {color: 9671571}})}><img src="/static/img/add.png" />Add embed</div>}
      </div>
      <div className={st.controls2}>
        <div className={cn(st.previewButton, {[st.enabled]: previewVisible})} onClick={() => setPreviewVisible(!previewVisible)}>
          {previewVisible ? <img src="/static/img/arrow/right.png" /> : <img src="/static/img/arrow/left.png" />}Preview
        </div>
      </div>
    </div>
  </Component>
}