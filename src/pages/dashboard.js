import React, { useEffect, memo } from 'react'
import st from './Dashboard.sass'
import { useLocation, useHistory } from 'react-router'
import cn from 'classnames'
import { l } from '../l'
import { plugins } from '../plugins'
import { useDispatch, useSelector } from 'react-redux'
import { Scroll } from '../components/scroll'
import value from '../../server/client/value'
import { Stats } from '../components/dashboard/stats'
import { pluginApi } from '../api'
import { useMemo } from 'react'
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
import { useLayout } from '../hooks/layout.hook'
import { Row2 } from '../components/Row2'
import { Nav } from '../components/dashboard/Nav'
import { EdgedButton } from '../components/button'
import { useAddGuild } from '../hooks/addguild.hook'

const Plugin = ({title, path, prefix}) => {
  const state = useSelector(s => s.guild.config.plugins[title]),
        api = useMemo(() => pluginApi(title), []),
        layout = useLayout()
  return <DashboardContainer k={title} title={l('plugin_' + title)} icon={`/static/img/plugins/${title}.png`} color={colors[title]} enabled={state.enabled} p {...{path, api}}>
    {title in plugins && React.createElement(plugins[title], {state, api, layout, prefix})}
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
        layout = useLayout(),
        [cookie] = useCookies(['guild', 'token']),
        state = useSelector(s => s.guild),
        guilds = useSelector(s => s.guilds),
        authorized = useSelector(s => s.authorized),
        [statsVisible, setStatsVisible] = useSettings('stats_visible', true),
        { connect, disconnect } = useConnection(),
        botInvited = !guilds || guilds.find(g => g.id === cookie.guild && g.bot),
        add = useAddGuild()
  useEffect(() => {
    if (props.demo) return
    disconnect()
    if (!guilds) return
    botInvited && connect(cookie.guild, authorized)
  }, [guilds, cookie.guild, authorized])
  useEffect(() => {
    if (location.pathname === props.path) document.title = `${props.demo ? 'Demo' : 'Dashboard'} - InfinityKit`
  }, [location])
  useEffect(() => () => disconnect(), [])
  console.log(state)
  return (
    <div id="plugins" className={cn('page', {ap3: layout.ap3})}>
      <div className="dashboardInner">
        <main>
          <Nav path={props.path} demo={props.demo} />
          {!botInvited && <div className={st.botInvitedError}>
            <div className={st.inner}>
              <div className={st.error}>BOT IS NOT INVITED</div>
              <EdgedButton className={st.invite} onClick={() => add(cookie.guild)} center compact>INVITE</EdgedButton>
            </div>
          </div>}
          {state && <>
            {Object.entries(state.config.plugins).map(([pluginName, plugin], i) => <Plugin title={pluginName} prefix={value.fromOptions(state.config.settings.prefix, 'prefix')} path={props.path} key={i} />)}
            <Settings path={props.path} />
            <Members path={props.path} />
            {/*<Log path={props.path} />*/}
            <div className={cn('plugins-list-page', {visible: location.pathname === props.path})}>
              {!state.permissions.dashboard.editing && <div className={st.alert}>VIEW MODE</div>}
              <div className="plugins-list-wr">
                <Scroll column>
                  <div className="plugins-list">
                    <Category order={0} dashboard>
                      <Stats visible={statsVisible} state={state.stats} />
                      <Row2 className="settings-buttons" els={[
                        <ReviewType2 name="STATS" onClick={() => setStatsVisible(!statsVisible)} className="settings-review" img={statsVisible ? '/static/img/arrow/top.png' : '/static/img/arrow/bottom.png'} />,
                        /*<ReviewType2 name="LOG" to={`${props.path}/log`} className="player-review" img="/static/img/log.png" />,*/
                        <ReviewType2 name="MEMBERS" to={`${props.path}/members`} className="members-review" img="/static/img/members.png" />,
                        <ReviewType2 name="SETTINGS" to={`${props.path}/settings`} className="settings-review" img="/static/img/settings.png" />
                      ]} column={layout.ap3} />
                    </Category>
                    <Category title="Server management" order={1} dashboard>
                      <PluginPreview plugins={['levels', 'moderation', 'automod']} state={state} updateState={props.updateState} path={props.path} />
                    </Category>
                    <Category title="Info" order={2} dashboard>
                      <PluginPreview plugins={['embeds', 'counters', 'alerts', 'welcome']} state={state} updateState={props.updateState} path={props.path} />
                    </Category>
                    <Category title="Utilities" order={3} dashboard>
                      <PluginPreview plugins={['reactionRoles', 'music', 'poll', 'userRooms']} state={state} updateState={props.updateState} path={props.path} />
                    </Category>
                  </div>
                </Scroll>
              </div>
            </div>
          </>}
        </main>
        {state && <DashboardSide />}
      </div>
    </div>
  )
}