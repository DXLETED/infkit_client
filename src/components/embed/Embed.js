import React from 'react'
import st from './Embed.sass'
import { Markdown } from './Markdown'
import moment from 'moment'
import cn from 'classnames'
import Color from 'color'

const Author = ({name, url, icon_url}) => <div className={st.author}>
  {icon_url && <img className={st.authorImg} src={icon_url} />}
  {url
    ? <a target="_blank" href={url}>{name}</a>
    : name}
</div>

const Title = ({title, url}) => <div className={st.title}>
  {url
    ? <a target="_blank" href={url}><Markdown str={title} mode="title" /></a>
    : <Markdown str={title} mode="title" />}
</div>

const Description = ({d}) => <div className={st.description}>
  <Markdown str={d} mode="embed" />
</div>

const Field = ({name, value, inline}) => <div className={cn(st.field, {[st.inline]: inline})}>
  <div className={st.fieldName}><Markdown str={name} mode="title" /></div>
  <div className={st.fieldValue}><Markdown str={value} mode="value" /></div>
</div>

const Fields = ({d}) => <div className={st.fields}>
  {(d || []).map((f, i) => <Field {...f} key={i} />)}
</div>

const EmbedContent = ({author, title, url, description, fields, image, footer}) => <div className={cn(st.content, {[st.m]: image || footer?.text})}>
  {author && <Author {...author} />}
  {title && <Title {...{title, url}} />}
  {description && <Description d={description} />}
  {fields && <Fields d={fields} />}
</div>

const EmbedImage = ({url}) => <div className={st.image}>
  <img src={url} />
</div>

const Footer = ({text, icon_url, timestamp}) => <div className={st.footer}>
  {icon_url && <img className={st.footerImg} src={icon_url} />}
  {text}{(text && timestamp) ? ' | ' : ''}{timestamp && moment(timestamp).format('ddd MMM Do, YYYY [at] h:mm A')}
</div>

const EmbedInner = ({d}) => <div className={st.inner}>
  <EmbedContent {...d} />
  {d.image && <EmbedImage {...d.image} />}
  {d.footer && <Footer {...d.footer} timestamp={d.timestamp} />}
</div>

const Thumbnail = ({url}) => <img className={st.richThumb} src={url} />

export const Embed = ({d = {}}) => <div className={st.embedWr}>
  <div className={st.color} style={{backgroundColor: Color(d.color).hex()}} />
  <div className={st.embed}>
    <EmbedInner {...{d}} />
    {d.thumbnail && <Thumbnail url={d.thumbnail.url} />}
  </div>
</div>