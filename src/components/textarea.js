import React, { useEffect, useState, useRef } from 'react'
import { Emoji, EmojiBtn } from "./emoji"
import { Scroll } from './scroll'
import cn from 'classnames'
import { emojis } from './emojis'
import { notify } from './notify'

import st from './TextArea.sass'
import { MessageVisualizer } from './MessageVisualizer'
import { Component } from './Component'

export const TextArea = props => {
  const [length, setLength] = useState()
  const [edit, setEdit] = useState(false)
  const ref = useRef()
  const getContent = (nodes, {md = false} = {}) => {
    if (!nodes) nodes = ref.current.childNodes
    let c = [...nodes].map(n => {
      if (n.nodeType === Node.TEXT_NODE)
        return n.textContent
      else if (n.localName === 'img' && n.dataset.label)
        return n.dataset.label
      else if (n.localName === 'br')
        return '\n'
    }).filter(Boolean).join('').replace(/\n$/g, '')
    const mdmatch = md && c.match(/^```(?:([a-z0-9_+\-.]+?)\n)?\n*([^\n][^]*?)\n*```/gm)
    Array.isArray(mdmatch) && mdmatch.map(m => c = c.replace(m, m.replace(/:[a-zA-Z0-9_]{1,25}:/g, p => emojis.getUnicode(p))))
    return c
  }
  const [content, setContent] = useState(props.value)
  const [previewVisible, setPreviewVisible] = useState(false)
  const updateLength = () => {
    const l = getContent().length
    setLength(l)
    props.onLengthUpdate?.(l)
  }
  const parseEmojis = ({setCursor=true} = {}) => {
    let target = ref.current
    let l
    while (l = [...target.childNodes]
      .filter(n => n.nodeType === Node.TEXT_NODE)
      .map(n => [n, [...n.textContent.matchAll(/:[a-zA-Z0-9_]{1,25}:/g)].filter(m => emojis.get(m[0]))])
      .filter(n => n[1].length)[0]) {
        let n = l[0]
        let m = l[1][0]
        if(!m) return
        let e = emojis.get(m[0])
        if (!e) return
        let range = document.createRange()
        range.selectNode(target)
        range.setStart(n, m.index)
        range.setEnd(n, m.index + m[0].length)
        range.deleteContents()
        let node = document.createElement('img')
        node.dataset.label = e.label
        node.classList.add(st.textEmoji)
        node.src = '/static/img/null.png'
        node.style.backgroundSize = `${emojis.width / emojis.size * 16}px ${emojis.height / emojis.size * 16}px`
        node.style.backgroundPosition = `-${e.x * 16}px -${e.y * 16}px`
        range.insertNode(node)
        if (setCursor) {
          let selection = window.getSelection()
          let srange = document.createRange()
          srange.selectNode(target)
          srange.setStart(target, 0)
          srange.setEnd([...target.childNodes][[...target.childNodes].findIndex(nn => nn === node) + 1] || nodes[nodes.length - 1], 0)
          srange.collapse(false)
          selection.removeAllRanges()
          selection.addRange(srange)
        }
    }
  }
  const updateValue = () => {
    ref.current.innerHTML = (props.value ? props.value.split('\n').map(v => v + '<br>').join('') : '').replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, p => emojis.getName(p))
    parseEmojis({setCursor: false})
    updateLength()
  }
  useEffect(() => {
    if (!props.nativeControls)
      if (edit)
        notify.yesno({description: 'Editable text has been changed', text: 'Update?'}, 15000, [updateValue])
      else
        updateValue()
  }, [props.value])
  useEffect(() => {
    edit
      ? props.onEditingStarted?.()
      : props.onEditingFinished?.()
    props.onEditingUpdate?.(edit)
  }, [edit])
  useEffect(() => {
    updateValue()
    props.getControls?.({
      insert: n => document.execCommand('insertText', false, n),
      cancel: () => {
        setEdit(false)
        updateValue()
      },
      save: () => {
        setEdit(false)
        props.set(getContent(null, {md: true}))
      }
    })
  }, [])
  return (
    <Component cln={st.textarea} rw={[st, ['m']]} {...props}>
      <div className={cn(st.textareaInner, {[st.h100]: props.h100})}>
        <Scroll deps={[content]}>
          <div className={st.input} suppressContentEditableWarning contentEditable spellCheck={false} onClick={() => {
            setEdit(true)
          }} onKeyDown={e => {
            if (e.keyCode === 13) {
              e.preventDefault()
              const selection = window.getSelection()
              const range = selection.getRangeAt(0)
              const el = document.createElement('br')
              range.insertNode(el)
              range.setStartAfter(el, 0)
              range.setEndAfter(el, 0)
            }
          }} onInput={e => {
            //undoImages.current.push([getContent(), [...ref.current.childNodes].findIndex(n => n === document.getSelection().anchorNode), document.getSelection().anchorOffset])
            const c = getContent()
            setContent(c)
            props.onContentUpdate?.(c)
            if (e.nativeEvent.inputType)
              parseEmojis()
            if (!length)
              updateLength()
          }} onKeyUp={() => window.requestIdleCallback ? window.requestIdleCallback(updateLength) : updateLength()} onCopy={e => {
            e.preventDefault()
            let content = window.getSelection().getRangeAt(0).cloneContents()
            let div = document.createElement('div')
            div.appendChild(content)
            e.clipboardData.setData('text/plain', getContent(div.childNodes).replace(/:[a-zA-Z0-9_]{1,25}:/g, p => emojis.getUnicode(p)))
          }} onCut={e => {
            e.preventDefault()
            let d = e.clipboardData.getData('text/plain').replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, p => emojis.getName(p))
            document.execCommand('insertHTML', false, d)
            parseEmojis({setCursor: e.clipboardData.getData('text/plain').length <= 2})
          }} onPaste={e => {
            e.preventDefault()
            let d = e.clipboardData.getData('text/plain').replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, p => emojis.getName(p))
            document.execCommand('insertHTML', false, d)
            parseEmojis({setCursor: e.clipboardData.getData('text/plain').length <= 2})
          }} aria-multiline={true} placeholder={!length ? props.placeholder : ''} ref={ref}></div>
          {previewVisible && <MessageVisualizer className={st.messageVisualizer} msg={{content}} bot />}
        </Scroll>
      </div>
      {props.nativeControls && <div className={st.nativeControls}>
        {props.emoji && <EmojiBtn className={st.emoji} set={e => {
          ref.current.focus()
          document.execCommand('insertText', false, e.label)
        }}><img src="/static/img/emojiBtn.png" /> Emoji</EmojiBtn>}
        <div className={cn(st.limit, {exceeded: length > (props.limit || 2000)})}>
          {length} / {props.limit || 2000}
        </div>
      </div>}
      {props.controls && <div className={cn(st.controls, {[st.edit]: edit})}>
        {props.emoji && <EmojiBtn className={st.emoji} set={e => {
          ref.current.focus()
          document.execCommand('insertText', false, e.label)
        }}><img src="/static/img/emojiBtn.png" /> Emoji</EmojiBtn>}
        <div className={cn(st.limit, {exceeded: length > (props.limit || 2000)})}>
          {length} / {props.limit || 2000}
        </div>
        <div className={st.cancel} onClick={() => {
          setEdit(false)
          updateValue()
        }}><img src="/static/img/delete.png" />Cancel</div>
        <div className={st.save} onClick={() => {
          setEdit(false)
          props.set(getContent(null, {md: true}))
        }}><img src="/static/img/done.png" />Save</div>
        <div className="fill" />
        {props.preview && <div className={cn(st.previewButton, {[st.enabled]: previewVisible})} onClick={() => setPreviewVisible(!previewVisible)}>
          {previewVisible ? <img src="/static/img/arrow/right.png" /> : <img src="/static/img/arrow/left.png" />}Preview
        </div>}
      </div>}
    </Component>
  )
}