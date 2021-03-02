import React from 'react'
import cn from 'classnames'
import { useMenu } from '../../hooks/menu.hook'
import { Switch } from '../switch'
import { useSettings } from '../../hooks/settings.hook'

import st from './side.sass'

const ClientSettingsSwitch = ({label, k, def}) => {
  const [s, set] = useSettings(k, def || false, {options: [true, false]})
  return <Switch enabled={s} set={set} p m>{label}</Switch>
}

export const ClientSettings = () => {
  const { s, close } = useMenu('settings')
  return <div className={cn(st.clientSettings, {[st.visible]: s})}>
    <ClientSettingsSwitch label="Show plugins description" k="plugins-description" def={true} />
    <ClientSettingsSwitch label="Auto reconnect" k="autoreconnect" def={true} />
    <div className={st.close} onClick={close}><img src="/static/img/arrow/bottom.png" /></div>
  </div>
}