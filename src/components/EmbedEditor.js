import st from './EmbedEditor.sass'

import React, { useState } from 'react'
import cn from 'classnames'
import { Component } from './Component'
import { Input } from './input'
import { TextArea } from './textarea'
import { Row } from './row'
import { ColorPicker } from './colorPicker'
import { EditableList } from './editableList'
import { Row2 } from './Row2'

const EmbedEditorItem = ({type = 'input', state, upd, set, label, ...props}) => {
  return <Component className={cn(st.embedEditorItem, {[st.input]: type === 'input', [st.textarea]: type === 'textarea', [st.color]: type == 'color'})} {...props}>
    {label && type !== 'color' && <div className={st.label}>{label}</div>}
    {type === 'input' && <Input value={state} input={set} fill b />}
    {type === 'textarea' && <TextArea value={state} onContentUpdate={set} nativeControls />}
    {type === 'color' && <ColorPicker label={label} c={state} set={set} flex />}
  </Component>
}

const EmbedEditorExpansion = ({title, rTitle, children}) => {
  const [isOpen, setIsOpen] = useState(false)
  return <div className={st.expansion}>
    <div className={st.title} onClick={() => setIsOpen(!isOpen)}>{title}<div className={st.rTitle}>{rTitle}<img src={`/static/img/arrow/${isOpen ? 'top' : 'bottom'}.png`} /></div></div>
    {isOpen ? children : <></>}
  </div>
}

const Field = ({f, api}) => <Row2 els={[
  <EmbedEditorItem label="Name" state={f.name} set={api.set.name} />,
  [<EmbedEditorItem label="Value" state={f.value} set={api.set.value} />, {style: {marginRight: 10}}]
]} />

export const EmbedEditor = ({embed, api}) => {
  return <Component cln={st.embedEditor}>
    <div className={st.head}><div className={st.name}>Embed</div><div className={st.remove} onClick={api.remove}><img src="/static/img/delete.png" />Remove</div></div>
    <EmbedEditorExpansion title="Author">
      <Row elements={[
        {width: 1, el: <EmbedEditorItem label="Avatar" state={embed.author?.icon_url} set={api.author.set.icon_url} />},
        {width: 4, el: <EmbedEditorItem label="Name" state={embed.author?.name} set={api.author.set.name} />}
      ]} m />
    </EmbedEditorExpansion>
    <EmbedEditorExpansion title="Title">
      <EmbedEditorItem label="Text" state={embed.title} set={api.set.title} m />
      <EmbedEditorItem label="URL" state={embed.url} set={api.set.url} m />
    </EmbedEditorExpansion>
    <EmbedEditorExpansion title="Description">
      <EmbedEditorItem type="textarea" state={embed.description} set={api.set.description} m />
    </EmbedEditorExpansion>
    <EmbedEditorExpansion title="Fields" rTitle={`${embed.fields?.length || 0} / 25`}>
      <EditableList data={(embed.fields || []).map((f, i) => <Field f={f} api={api.fields.field(i)} key={i} />)} add={api.fields.add} delete={d => api.fields.field(d).del()} limit={25} column nobg hiddenLimit m />
    </EmbedEditorExpansion>
    <EmbedEditorExpansion title="Footer">
      <Row elements={[
        {width: 1, el: <EmbedEditorItem label="Icon" state={embed.footer?.icon_url} set={api.footer.set.icon_url} />},
        {width: 4, el: <EmbedEditorItem label="Text" state={embed.footer?.text} set={api.footer.set.text} />}
      ]} m />
    </EmbedEditorExpansion>
    <ColorPicker label="Color" c={embed.color || 0} onChange={api.set.color} nocontrols m />
    <Row elements={[
      <EmbedEditorItem label="Image" state={embed.image?.url} set={api.set.image} />,
      <EmbedEditorItem label="Thumbnail" state={embed.thumbnail?.url} set={api.set.thumbnail} />
    ]} m />
  </Component>
}