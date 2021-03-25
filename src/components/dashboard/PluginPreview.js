import React, { memo, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { useSettings } from '../../hooks/settings.hook'
import equal from 'fast-deep-equal'
import { pluginApi } from '../../api'
import cn from 'classnames'
import { l } from '../../l'
import { colors } from '../colorlist'

import st from './PluginPreview.sass'
import { useLayout } from '../../hooks/layout.hook'

const PluginPreviewEl = memo(({pn, path, i, length}) => {
  let history = useHistory()
  const state = useSelector(s => s.guild.plugins[pn])
  const api = useMemo(() => pluginApi(pn), [])
  const [pluginDesc] = useSettings('plugins-description')
  const layout = useLayout()
  return <div to={`${path}/${pn}`}
    className={cn(st.pluginPreview, {[st.enabled]: state?.enabled ?? true, [st.m]: i - length < -(layout.ap2 ? layout.ap4 ? 1 : 2 : 3)})}
    onClick={() => history.push(`${path}/${pn}`)}>
    <img src={`/static/img/plugins/${pn}.png`} />
    <div className={st.d}>
      <div className={st.name}>{l('plugin_' + pn)}</div>
      {pluginDesc && <div className={st.desc}>{l('plugindesc_' + pn, {pl: state})}</div>}
    </div>
    {state?.enabled !== undefined && <div className={st.enabled} onClick={e => {
      api.enabled.toggle()
      e.stopPropagation()
    }}>{state?.enabled ? <img src="/static/img/on.png" /> : <img src="/static/img/off.png" />}</div>}
    <div className={st.border} style={{background: colors[pn]}} />
    <div className={st.color} style={{background: colors[pn]}} />
  </div>
}, (o, n) => equal(o.enabled, n.enabled))

export const PluginPreview = ({plugins, path}) => {
  return <div className={st.pluginPreviewList}>{plugins.map((plugin, i) => <PluginPreviewEl pn={plugin} path={path} i={i} length={plugins.length} key={i} />)}</div>
}