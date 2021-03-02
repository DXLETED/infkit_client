import React, { useEffect, memo } from 'react'
import { useLocation, useHistory } from 'react-router'
import cn from 'classnames'
import { l } from '../l'
import { plugins } from '../plugins'
import { useSelector } from 'react-redux'
import { Scroll } from '../components/scroll'
import value from '../../server/discord/value'
import { Stats } from '../components/dashboard/stats'
import { pluginApi } from '../api'
import { useMemo } from 'react'
import { Row } from '../components/row'
import { Settings } from '../components/settings'
import { useSettings } from '../hooks/settings.hook'
import { DashboardSide } from '../components/dashboard/side'
import { useCookies } from 'react-cookie'
import { Members } from '../components/dashboard/members'
import { useConnection } from '../hooks/connection.hook'
import { PluginPreview } from '../components/dashboard/PluginPreview'
import { Category } from '../components/Category'
import { DashboardContainer } from '../components/dashboard/Container'
import { colors } from '../components/colorlist'
import { Log } from '../components/dashboard/Log'
import { notify } from '../components/notify'

const Plugin = ({title, path, prefix}) => {
  const state = useSelector(s => s.guild.plugins[title])
  const api = useMemo(() => pluginApi(title), [])
  return <DashboardContainer k={title} title={l('plugin_' + title)} icon={`/static/img/plugins/${title}.png`} color={colors[title]} enabled={state.enabled} p {...{path, api}}>
    {title in plugins && React.createElement(plugins[title], {state, api, prefix})}
  </DashboardContainer>
}

const ReviewType2 = memo(({name, to, className, img, onClick}) => {
  const history = useHistory()
  return <div className={cn('preview_type2', className)} onClick={e => {
    history.push(to)
    onClick && onClick(e)
  }}>
    <div className="border" />
    <div className="preview_type2__d">{img && <img className="preview_type2__d__img" src={img} />}{name}</div>
    <div className="preview_type2__color" />
  </div>
})

export const Dashboard = props => {
  const location = useLocation(),
        history = useHistory(),
        [cookie] = useCookies(['guild', 'token']),
        state = useSelector(s => s.guild),
        authorized = useSelector(s => s.authorized),
        [statsVisible, setStatsVisible] = useSettings('stats_visible', true),
        { connect } = useConnection()
  useEffect(() => {
    connect(cookie.guild, authorized)
  }, [cookie.guild, authorized])
  useEffect(() => {
    if (location.pathname === props.path) document.title = `${props.demo ? 'Demo' : 'Dashboard'} - InfinityKit`
  }, [location])
  /*useEffect(() => {
    setTimeout(() => navigator.userAgent.toLowerCase().indexOf('firefox') > -1 && notify.question({
        title: 'Firefox detected',
        text: 'The site may look worse in this browser, but it can be fixed',
        options: [['Find out how', () => history.push('firefox-fix')], ['Later', () => 1], ['Do not remind', () => 1]]
      }), 5000)
  }, [])*/
  if (!state) return <></>
  return (
    <div id="plugins" className={cn('page')}>
      <main>
        {Object.entries(state.plugins).map(([pluginName, plugin], i) => <Plugin title={pluginName} prefix={value.fromOptions(state.settings.prefix, 'prefix')} path={props.path} key={i} />)}
        <Settings path={props.path} />
        <Members path={props.path} />
        <Log path={props.path} />
        <div className={cn('plugins-list-page', {visible: location.pathname === props.path})}>
          <div className="plugins-list-wr">
            <Scroll column>
              <div className="plugins-list">
                {props.path === '/demo' && <div className="demo-alert">DEMO MODE | Сhanges will be lost when the page is reloaded</div>}
                <Stats visible={statsVisible} state={state.stats} />
                <Row className="settings-buttons" elements={[
                  <ReviewType2 name="STATS" onClick={() => setStatsVisible(!statsVisible)} className="settings-review" img={statsVisible ? '/static/img/arrow/top.png' : '/static/img/arrow/bottom.png'} />,
                  <ReviewType2 name="LOG" to={`${props.path}/log`} className="player-review" img="/static/img/log.png" />,
                  <ReviewType2 name="MEMBERS" to={`${props.path}/members`} className="members-review" img="/static/img/members.png" />,
                  <ReviewType2 name="SETTINGS" to={`${props.path}/settings`} className="settings-review" img="/static/img/settings.png" />
              ]} />
                <Category title="Server management" dashboard>
                  <PluginPreview plugins={['levels', 'moderation', 'automod']} state={state} updateState={props.updateState} path={props.path} />
                </Category>
                <Category title="Info" dashboard>
                  <PluginPreview plugins={['welcome', 'counters', 'alerts']} state={state} updateState={props.updateState} path={props.path} />
                </Category>
                <Category title="Utilities" dashboard>
                  <PluginPreview plugins={['reactionRoles', 'music', 'poll', 'userRooms']} state={state} updateState={props.updateState} path={props.path} />
                </Category>
              </div>
            </Scroll>
          </div>
        </div>
      </main>
      <DashboardSide />
    </div>
  )
}