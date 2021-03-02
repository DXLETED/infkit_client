import React from 'react'
import st from './PreviewChannel.sass'

const channelType = type => [['text', 'd-text'], ['voice', 'd-voice'], ['category', 'd-category']].find(t => t[0] === type)?.[1]

export const PreviewChannel = ({name, type}) => <div className={st.previewChannel}><img src={channelType(type) && `/static/img/${channelType(type)}.png`} />{name}</div>