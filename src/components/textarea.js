import React, { useEffect, useState, useRef } from 'react'
import { Emoji } from "./emoji"
import { Scroll } from './scroll'
import cn from 'classnames'
import { emojis } from './emojis'
import { unicode } from 'emojis'
import { notify } from './notify'

export const TextArea = props => {
  const [length, setLength] = useState()
  const [edit, setEdit] = useState(false)
  let ref = useRef()
  const getContent = nodes => {
    if (!nodes) nodes = ref.current.childNodes
    return [...nodes].map(n => {
      if (n.nodeType === Node.TEXT_NODE)
        return n.textContent
      else if (n.localName === 'img' && n.dataset.label)
        return n.dataset.label
      else if (n.localName === 'br')
        return '\n'
    }).filter(Boolean).join('').replace(/\n$/gm, '')
  }
  const updateLength = () => setLength(getContent().length)
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
        console.log(n.textContent)
        range.setStart(n, m.index)
        range.setEnd(n, m.index + m[0].length)
        range.deleteContents()
        let node = document.createElement('img')
        node.dataset.label = e.label
        node.classList.add('text-emoji')
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
    //setLength(getContent().length)
  }
  const updateValue = () => {
    ref.current.innerHTML = props.value ? props.value.split('\n').map(v => v + '<br>').join('') : ''
    parseEmojis({setCursor: false})
    updateLength()
  }
  useEffect(() => {
    if (edit)
      notify.yesno({description: 'Editable text has been changed', text: 'Update?'}, 15000, [updateValue])
    else
      updateValue()
  }, [props.value])
  useEffect(() => {
    document.addEventListener('click', e => {
      if ((!e.target.closest('.textarea') && !e.target.closest('#modal-emoji')) || e.target.closest('.textarea').querySelector('.ta-input') !== ref.current)
        setEdit(false)
    })
  }, [])
  return (
    <div className="textarea">
      <div className={cn('ta-control', {edit})}>
        <div className="ta-emoji">{props.emoji && <Emoji set={e => {
          ref.current.focus()
          document.execCommand('insertText', false, e.label)
          //parseEmojis()
        }} />}</div>
        <div className={cn('ta-limit', {exceeded: length > (props.limit || 2000)})}>
          <div className="ta-length">{length}</div>
          <div className="br"></div>
          <div className="ta-lim">{props.limit || 2000}</div>
          </div>
        <div className="ta-save" onClick={() => {
          setEdit(false)
          props.set(getContent())
          console.log(getContent())
        }}><img src="/static/img/done.png" /></div>
      </div>
      <Scroll reff={r => ref.current = r.current}>
        <div className="ta-input" suppressContentEditableWarning contentEditable spellCheck={false} onClick={() => setEdit(true)} onKeyDown={e => {
          if (e.keyCode === 13) {
            document.execCommand('insertHTML', false, '<br><br>')
            e.preventDefault()
            return false
          }
        }} onInput={e => {
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
        }} onPaste={e => {
          e.preventDefault()
          let d = e.clipboardData.getData('text/plain').replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, p => emojis.getName(p))
          document.execCommand('insertHTML', false, d)
          parseEmojis({setCursor: e.clipboardData.getData('text/plain').length <= 2})
        }} aria-multiline={true} placeholder={!length ? props.placeholder : ''}></div>
      </Scroll>
    </div>
  )
}