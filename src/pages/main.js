import React, { memo, useEffect, useRef, useState } from 'react'
import { Scroll } from '../components/scroll'
import { Stars } from '../components/main/stars'
import { Guilds } from '../components/main/guilds'
import { Features, FeaturesPreview } from '../components/main/Features'
import { useScroll } from '../hooks/scroll.hook'

import st from './Main.sass'

const PreviewArrow = () => {
  const scrollTop = useScroll('.page#main > .main', 2, 0, 200)
  return <div className="preview-arrow_wr" style={{opacity: (200 - scrollTop) / 200}}><div className="preview-arrow"><div className="p-arrow p-arrow__1" /><div className="p-arrow p-arrow__2" /></div></div>
}

const Page = memo(() => <>
    <div className={st.screenStart}>
      <div className={st.preview}>
        <div className={st.site}>
          <div className={st.beta}>PRE-BETA</div>
          <div className={st.sitename}>InfinityKit</div>
          <div className={st.description}>The most customizable bot for Discord</div>
        </div>
        <Guilds />
      </div>
      <FeaturesPreview />
      <PreviewArrow />
    </div>
    <Stars />
    <Features />
    <div className={st.footer}>
      <div className={st.copyright}>© Copyright InfinityKit 2020-2021. All rights reserved.</div>
      <div className={st.notAffiliated}>Not affiliated with Discord Inc.</div>
    </div>
  </>
)

export const MainPage = () => {
  useEffect(() => {
    if (location.pathname === '/') document.title = 'InfinityKit'
  }, [location])
  return (
    <div id="main" className="page">
      <Scroll className="main" relative column>
        <Page />
      </Scroll>
    </div>
  )
}