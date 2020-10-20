import React, { useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import { MultiSwitch } from './multiSwitch'
import { Label } from './label'
import { ObjectEdit } from './objectEdit'
import { Select } from './select'
import { Switch } from './switch'
import { CategoryName } from './categoryName'
import { Scroll } from './scroll'
import { useSelector } from 'react-redux'
import { settingsApi } from '../api'
import { useLocation } from 'react-router'
import { NavLink } from 'react-router-dom'
import { colors } from './colorlist'
import { CSSTransition } from 'react-transition-group'
import { Row } from './row'

export const Settings = props => {
  const state = useSelector(s => s.guild.settings),
        api = useMemo(() => settingsApi, [])
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  const [v2, setV2] = useState(false)
  useEffect(() => {
    setVisible(location.pathname === `${props.path}/settings`)
    if (location.pathname === `${props.path}/settings`) document.title = 'Settings - InfinityKit'
  }, [location])
  return (
    <CSSTransition in={visible} classNames="dashboard-item-fadein" timeout={200} onEnter={() => setV2(true)} onExited={() => setV2(false)}>
      <div id="settings" className={cn('page settings-page')}>
        {v2 && <main>
          <div className="title">
            <NavLink to={props.path} className="back">
              <img src="/static/img/arrow/left.png" />
            </NavLink>
            <img src={`/static/img/settings.png`} />
            <div className="plugin-title">Settings</div>
            <div className="title-color" style={{background: colors.grey}} />
            <div className="pp-border" style={{background: colors.grey}} />
            <div className="border" style={{background: colors.grey}} />
          </div>
          <div className="settings-wr">
            <Scroll>
              <div className="settings">
                <div className="general category">
                  <CategoryName>General</CategoryName>
                  <MultiSwitch label="Perfix" type="string" options={['`', '/', '!', '~', '@', '>']} selected={state.prefix} set={api.prefix} limit={2} custom m />
                  <Select label="Language" type="options" selected={state.language} dropdown={['English', 'Russian']} options={['en', 'ru']} set={api.setLanguage} m />
                  <ObjectEdit label="Admin roles" type="roles" data={state.admRoles} default="Only administrators by default"
                    add={api.admRoles.add}
                    delete={api.admRoles.del} m />
                </div>
                <div className="personalization category">
                  <CategoryName>Personalization</CategoryName>
                  <Row elements={[
                    <Switch enabled={state.nopermRole} set={api.toggle.nopermRole}>MESSAGE: No rights</Switch>,
                    <Switch enabled={state.nopermChannel} set={api.toggle.nopermChannel} m>MESSAGE: Wrong channel</Switch>
                  ]} />
                </div>
              </div>
            </Scroll>
          </div>
        </main>}
      </div>
    </CSSTransition>
  )
}