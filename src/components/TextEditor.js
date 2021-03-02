import React, { useState } from 'react'
import { TextArea } from './textarea'

export const TextEditor = ({value}) => {
  const [txt, setTxt] = useState(value)
  return <div className={st.embedEditor}>
    <div className={st.embedEditorInner}>
      <TextArea value={txt.content} onInput={n => setTxt({...txt, content: n})} />
    </div>
  </div>
}