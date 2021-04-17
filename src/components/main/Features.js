import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { memo } from 'react'
import { colors } from '../colorlist'

import st from './Features.sass'
import { VideoHover } from './VideoHover'

const FeaturesPreviewItem = ({name, color, indev}) => <div className={cn(st.item, {indev})}>
  {indev ? <s>{name}</s> : name}
  <div className={st.border} style={{background: color}} />
</div>

const FeaturesItem = memo(({title, text, src, color, reversed = false} = {}) => {
  const [height, setHeight] = useState(null)
  const imgRef = useRef()
  const onMouseEnter = e => setHeight(window.getComputedStyle(imgRef.current).getPropertyValue('height'))
  const onMouseLeave = e => setHeight(null)
  return <div className={cn(st.item, {[st.reversed]: reversed})} {...{onMouseEnter, onMouseLeave}}>
    <div className={st.itemInner}>
      <div className={st.img} style={{height}}><img src={src} ref={imgRef} /></div>
      <div className={st.d}>
        <div className={st.title} style={{borderColor: color}}>{title}</div>
        <div className={st.line} style={{background: color}} />
        <div className={st.text}>{text}</div>
      </div>
    </div>
  </div>
})

export const FeaturesPreview = () => <div className={st.featuresPreview}>
  <FeaturesPreviewItem name="Dashboard" color={colors.white} />
  <FeaturesPreviewItem name="Customization" color={colors.pink} />
  <FeaturesPreviewItem name="Leveling system" color={colors.levels} />
  <FeaturesPreviewItem name="Automod" color={colors.automod} />
  <FeaturesPreviewItem name="Embeds" color={colors.embeds} />
  <FeaturesPreviewItem name="Music player" color={colors.music} />
  <FeaturesPreviewItem name="Twitch alerts" color={colors.alerts} />
  <FeaturesPreviewItem name="Server stats" color={colors.counters} />
  <FeaturesPreviewItem name="Co-Editing" color={colors.grey} />
</div>

export const Features = () => <div className={st.features}>
  <FeaturesItem title="Dashboard" text="All settings and statistics are located in the control panel. You don't need commands anymore" src="/static/img/features/dashboard.png" color={colors.white} />
  <FeaturesItem title="Customization" text="Best customization among all bots" src="/static/img/features/customization.png" color={colors.pink} reversed />
  <FeaturesItem title="Leveling system" text="Encourage active members" src="/static/img/features/leveling_system.png" color={colors.levels} />
  <FeaturesItem title="Music player" text="Control music directly from the app" src="/static/img/features/music_player.png" color={colors.music} reversed />
  <FeaturesItem title="Twitch alerts" text="Notify people when streams are launched" src="/static/img/features/alerts.png" color={colors.alerts} />
  <FeaturesItem title="Server stats" text="Follow the development of the server" src="/static/img/features/stats.png" color={colors.counters} reversed />
  {/*<div className={st.item_2}>
    <div className={st.title} style={{borderColor: colors.grey}}>Co-Editing</div>
    <VideoHover className={st.video} />
  </div>*/}
</div>