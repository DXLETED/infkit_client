import React from 'react'
import st from './Embed.sass'
import { Markdown } from './Markdown'
import moment from 'moment'
import cn from 'classnames'
import Color from 'color'
import { Component } from '../Component'

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

const EmbedContentInner = ({author, title, url, description, fields, image, footer}) => <div className={cn(st.contentInner, {[st.m]: image || footer?.text})}>
  {author && <Author {...author} />}
  {title && <Title {...{title, url}} />}
  {description && <Description d={description} />}
  {fields && <Fields d={fields} />}
</div>

const Thumbnail = ({url}) => <img className={st.richThumb} src={url} />

const EmbedContent = ({d}) => <div className={st.content}>
  <EmbedContentInner {...d} />
  {d.thumbnail && <Thumbnail url={d.thumbnail.url} />}
</div>

const EmbedImage = ({url}) => <div className={st.image}>
  <img src={url} />
</div>

const Footer = ({text, icon_url, timestamp}) => <div className={st.footer}>
  {icon_url && <img className={st.footerImg} src={icon_url} />}
  {text}{(text && timestamp) ? ' | ' : ''}{timestamp && moment(timestamp).format('ddd MMM Do, YYYY [at] h:mm A')}
</div>

export const Embed = ({d = {}, ...props}) => <Component className={st.embedWr} {...props}>
  <div className={st.color} style={{backgroundColor: Color(d.color || '#000000').hex()}} />
  <div className={st.embed}>
    <EmbedContent d={d} />
    {d.image && <EmbedImage {...d.image} />}
    {d.footer && <Footer {...d.footer} timestamp={d.timestamp} />}
  </div>
</Component>