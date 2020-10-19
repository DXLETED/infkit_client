import React, { useEffect, useState, useRef, useReducer, memo } from 'react'
import { useLocation, Route, useHistory } from 'react-router'
import cn from 'classnames'
import { NavLink } from 'react-router-dom'
import { l } from '../l'
import { plugins } from '../plugins'
import { useSelector, useDispatch } from 'react-redux'
import { Scroll } from '../components/scroll'
import { colors } from '../components/colorlist'
import { Groups } from '../components/dashboard/groups'
import value from '../../server/discord/value'
import { CategoryName } from '../components/categoryName'
import { Stats } from '../components/dashboard/stats'
import equal from 'fast-deep-equal'
import { pluginApi } from '../api'
import { useMemo } from 'react'
import { Row } from '../components/row'
import { Settings } from '../components/settings'
import { CSSTransition } from 'react-transition-group'
import { useSettings } from '../hooks/settings.hook'
import { ConnectionState } from '../components/dashboard/connetionState'
import { DashboardSide } from '../components/dashboard/side'

const Plugin = props => {
  const state = useSelector(s => s.guild.plugins[props.title])
  const api = useMemo(() => pluginApi(props.title), [])
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  const [v2, setV2] = useState(false)
  useEffect(() => {
    setVisible(location.pathname === `${props.path}/${props.title}`)
  }, [location])
  useEffect(() => {
    if (v2) document.title = `${l(`plugin_${props.title}`)} - InfinityKit`
  }, [v2])
  return (
    <CSSTransition in={visible} classNames="dashboard-item-fadein" timeout={200} onEnter={() => setV2(true)} onExited={() => setV2(false)}>
      <div className={cn('plugin-page')}>
        {v2 && <>
          <div className="title">
            <NavLink to={props.path} className="back">
              <img src="/static/img/arrow/left.png" />
            </NavLink>
            <img src={`/static/img/plugins/${props.title}.png`} />
            <div className="plugin-title">{l('plugin_' + props.title)}</div>
            <div className="title-color" style={{background: colors[props.title]}} />
            <div className="p-enabled" onClick={api.enabled.toggle}>{state.enabled ? <><img src="/static/img/on.png" />ENABLED</> : <><img src="/static/img/off.png" />DISABLED</>}</div>
            <div className="pp-border" style={{background: colors[props.title]}} />
            <div className="border" style={{background: colors[props.title]}} />
          </div>
          <div className={cn('plugin-wr')}>
            <Scroll>
              <div id={'plugin-' + props.title} className={cn('plugin', {visible})}>
                {props.title in plugins && React.createElement(plugins[props.title], {...props, state, api})}
              </div>
            </Scroll>
          </div>
        </>}
      </div>
    </CSSTransition>
  )
}

const PluginReviewEl = memo(props => {
  const { pn, path } = props
  let history = useHistory()
  const state = useSelector(s => s.guild.plugins[pn])
  const api = useMemo(() => pluginApi(pn), [])
  return (
    <div to={`${path}/${pn}`} className={cn('plugin-preview', {enabled: state.enabled})} onClick={() => history.push(`${path}/${pn}`)}>
      <img src={`/static/img/plugins/${pn}.png`} />
      <div className="pp-d">
        <div className="pp-name">{l('plugin_' + pn)}</div>
        <div className="pp-desc">{l('plugindesc_' + pn)}</div>
      </div>
      <div className="pp-enabled" onClick={e => {
        api.enabled.toggle()
        e.stopPropagation()
      }}>{state.enabled ? <img src="/static/img/on.png" /> : <img src="/static/img/off.png" />}</div>
      <div className="pp-border" style={{background: colors[pn]}} />
      <div className="pp-color" style={{background: colors[pn]}} />
    </div>
  )
}, (o, n) => equal(o.enabled, n.enabled))

const PluginReview = props => {
  return props.plugins.map((plugin, i) => <PluginReviewEl pn={plugin} path={props.path} key={i} />)
}

const ReviewType2 = memo(({name, to, className, img, onClick}) => {
  const history = useHistory()
  return <div className={cn('preview_type2', className)} onClick={e => {
    history.push(to)
    onClick && onClick(e)
  }}>
    <div className="preview_type2__d">{name}{img && <img className="preview_type2__d__img" src={img} />}</div>
    <div className="preview_type2__color" />
  </div>
})

export const Dashboard = props => {
  const location = useLocation()
  const state = useSelector(s => s.guild)
  const cnct = props.cn
  const [statsVisible, setStatsVisible] = useSettings('stats_visible', true)
  useEffect(() => {
    if (location.pathname === props.path) document.title = `${props.demo ? 'Demo' : 'Dashboard'} - InfinityKit`
  }, [location])
  return (
    <div id="plugins" className={cn('page')}>
      <main>
        {state && Object.entries(state.plugins).map(([pluginName, plugin], i) => <Plugin title={pluginName} state={plugin} updateState={(n, events) => props.updateState({...state, plugins: {...state.plugins, ...{[pluginName]: n}}, events})} prefix={value.fromOptions(state.settings.prefix, 'prefix')} path={props.path} key={i} />)}
        {state && <Settings path={props.path} />}
        <div className={cn('plugins-list-page', {visible: location.pathname === props.path})}>
          <div className="plugins-list-wr">
            <Scroll>
              <div className="plugins-list">
                {state && <>
                  {props.path === '/demo' && <div className="demo-alert">DEMO MODE | Сhanges will be lost when the page is reloaded</div>}
                  <Stats visible={statsVisible} state={state.stats} />
                  <Row className="settings-buttons" elements={[
                    <ReviewType2 name="STATS" onClick={() => setStatsVisible(!statsVisible)} className="settings-review" img={statsVisible ? '/static/img/arrow/top.png' : '/static/img/arrow/bottom.png'} />,
                    <ReviewType2 name="SETTINGS" to={`${props.path}/settings`} className="settings-review" img="/static/img/settings.png" />
                ]} />
                  <div className="category">
                    <CategoryName>Server management</CategoryName>
                    <div className="list">
                      <PluginReview plugins={['levels', 'moderation', 'automod']} state={state} updateState={props.updateState} path={props.path} />
                    </div>
                  </div>
                  <div className="category">
                    <CategoryName>Info</CategoryName>
                    <div className="list">
                      <PluginReview plugins={['welcome', 'counters', 'alerts']} state={state} updateState={props.updateState} path={props.path} />
                    </div>
                  </div>
                  <div className="category">
                    <CategoryName>Utils</CategoryName>
                    <div className="list">
                      <PluginReview plugins={['reactionRoles', 'music', 'poll', 'userRooms']} state={state} updateState={props.updateState} path={props.path} />
                    </div>
                  </div>
                </>}
              </div>
            </Scroll>
          </div>
        </div>
      </main>
      <DashboardSide />
    </div>
  )
}