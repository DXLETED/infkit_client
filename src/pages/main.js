import React, { memo, useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { useCookies } from 'react-cookie'
import { useSelector } from 'react-redux'
import { EdgedButton } from '../components/button'
import { Scroll } from '../components/scroll'
import { colors } from '../components/colorlist'
import { useCallbackRef } from 'use-callback-ref'
import { Stars } from '../components/main/stars'
import { Guilds } from '../components/main/guilds'
import { VideoHover } from '../components/main/VideoHover'
import { FeaturesItem, FeaturesPreviewItem } from '../components/main/Features'
import { useScroll } from '../hooks/scroll.hook'

const PreviewArrow = () => {
  const scrollTop = useScroll('.page#main > main', 2, 0, 200)
  return <div className="preview-arrow_wr" style={{opacity: (200 - scrollTop) / 200}}><div className="preview-arrow"><div className="p-arrow p-arrow__1" /><div className="p-arrow p-arrow__2" /></div></div>
}

const Page = memo(() => <>
    <div className="screen-start">
      <div className="preview">
        <div className="site">
          <div className="beta">PRE-BETA</div>
          <div className="sitename">InfinityKit</div>
          <div className="description">The most customizable bot for Discord</div>
        </div>
        <Guilds />
      </div>
      <div className="features-preview">
        <FeaturesPreviewItem name="Dashboard" color={colors.white} />
        <FeaturesPreviewItem name="Customization" color={colors.pink} />
        <FeaturesPreviewItem name="Leveling system" color={colors.levels} />
        <FeaturesPreviewItem name="Automod" color={colors.moderation} />
        <FeaturesPreviewItem name="Embeds (in-dev)" color={colors.welcome} indev />
        <FeaturesPreviewItem name="Music player" color={colors.music} />
        <FeaturesPreviewItem name="Twitch alerts" color={colors.alerts} />
        <FeaturesPreviewItem name="Server stats" color={colors.counters} />
        <FeaturesPreviewItem name="Co-Editing" color={colors.grey} />
        <FeaturesPreviewItem name="And more" color={colors.dgrey} />
      </div>
      <PreviewArrow />
    </div>
    <Stars />
    <div className="features">
      <FeaturesItem title="Dashboard" text="All settings and statistics are located in the control panel. You don't need commands anymore" src="/static/img/features/dashboard.png" color={colors.white} />
      <FeaturesItem title="Customization" text="Best customization among all bots" src="/static/img/features/customization.png" color={colors.pink} reversed />
      <FeaturesItem title="Leveling system" text="Encourage active members" src="/static/img/features/leveling_system.png" color={colors.levels} />
      <FeaturesItem title="Music player" text="Control music directly from the app" src="/static/img/features/music_player.png" color={colors.music} reversed />
      <FeaturesItem title="Twitch alerts" text="Notify people when streams are launched" src="/static/img/features/alerts.png" color={colors.alerts} />
      <FeaturesItem title="Server stats" text="Follow the development of the server" src="/static/img/features/stats.png" color={colors.counters} reversed />
      <div className="features__item_2">
        <div className="features__item_2__title" style={{borderColor: colors.grey}}>Co-Editing</div>
        <VideoHover className="features__item_2__video" />
      </div>
    </div>
    <div className="footer">
      <div className="copyright">© Copyright InfinityKit 2020. All rights reserved.</div>
      <div className="not-affiliated">Not affiliated with Discord Inc.</div>
    </div>
  </>
)

export const MainPage = () => {
  useEffect(() => {
    if (location.pathname === '/') document.title = 'InfinityKit'
  }, [location])
  return (
    <div id="main" className="page">
      <Scroll>
        <main>
          <Page />
        </main>
      </Scroll>
    </div>
  )
}