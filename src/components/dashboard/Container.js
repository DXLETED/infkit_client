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
        <div className={st.title}>
          <NavLink to={path} className={st.back}>
            <img src="/static/img/arrow/left.png" />
          </NavLink>
          <img src={icon} />
          <div className={st.label}>{title}</div>
          {enabled !== undefined && api && <div className={st.enabled} onClick={api.enabled.toggle}>{enabled ? <><img src="/static/img/on.png" />ENABLED</> : <><img src="/static/img/off.png" />DISABLED</>}</div>}
          <div className={st.color} style={{background: color || colors.grey}} />
          <div className={st.border} style={{background: color || colors.grey}} />
        </div>
        <div className={cn(st.dashboardPageWr, `${k}-wr`)}>
          <Scroll deps={[visible, v2, ...deps || []]}>
            <div className={cn(st.dashboardPage, className)}>
              {children}
            </div>
          </Scroll>
        </div>
      </>}
    </div>
  </CSSTransition>
}