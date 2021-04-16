import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { CSSTransition } from 'react-transition-group'
import { useLocation } from 'react-router'
import { NavLink } from 'react-router-dom'
import { colors } from '../colorlist'
import { Scroll } from '../scroll'

import st from './Container.sass'
import fadeSt from './ContainerFade.sass'

export const DashboardContainer = ({k, icon, title, enabled, color, path, className, deps, children, api, p}) => {
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  const [v2, setV2] = useState(false)
  useEffect(() => {
    setVisible(location.pathname === `${path}/${k}`)
    if (location.pathname === `${path}/${k}`) document.title = `${title} - InfinityKit`
  }, [location])
  return <CSSTransition in={visible} classNames={fadeSt} timeout={200} onEnter={() => setV2(true)} onExited={() => setV2(false)}>
    <div id={k} className={cn(st.dashboardPageContainer, `${k}-page`, {[st.p]: p})}>
      {v2 && <>
        <div className={cn(st.dashboardPageWr, `${k}-wr`)}>
          <Scroll className={cn(st.dashboardPage, className, {disabled: enabled === false})} deps={[visible, v2, ...deps || []]}>
            {children}
          </Scroll>
        </div>
        {enabled === false && <div className={st.overlay}><div className={st.inner}>PLUGIN DISABLED</div></div>}
      </>}
    </div>
  </CSSTransition>
}