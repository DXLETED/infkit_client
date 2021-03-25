import moment from 'moment'
import objectPath from 'object-path'

let en = {
  plugin_levels: 'Levels',
  plugin_moderation: 'Moderation',
  plugin_automod: 'Automod',
  plugin_embeds: 'Embeds',
  plugin_welcome: 'Welcome',
  plugin_reactionRoles: 'Reaction Roles',
  plugin_music: 'Music',
  plugin_userRooms: 'User rooms',
  plugin_counters: 'Counters',
  plugin_poll: 'Poll',
  plugin_alerts: 'Twitch alerts',
  plugindesc_levels: 'Rewards / !rank | !addxp',
  plugindesc_moderation: '!clear | !warn | !kick | !ban ...',
  plugindesc_automod: 'Filters | AutoActions',
  plugindesc_embeds: 'Just a messages',
  plugindesc_reactionRoles: ({pl}) => `${pl.d.length} ${pl.d.length === 1 ? 'message' : 'messages'}`,
  plugindesc_welcome: 'Greeting new members',
  plugindesc_counters: ({pl}) => `Last update: ${pl.d.find(el => el.lastUpdate) ? moment(Math.max(...pl.d.map(el => el.lastUpdate))).fromNow() : '-----'}`,
  plugindesc_alerts: 'Notices about videos, streams',
  plugindesc_music: ({pl}) => pl.np?.title ? `${pl.resumed ? '▶' : '❚❚'} ${pl.np.title}` : 'Nothing playing',
  plugindesc_poll: '0 polls last week',
  plugindesc_userRooms: ({pl}) => `${Object.entries(pl.channels).length} channels active`,
  cmddesc_rank: 'Your rank card or another member',
  cmddesc_addxp: 'Adds XP to you or another member',
  cmddesc_clear: 'Delete channel messages',
  cmddesc_warn: 'Warns a user',
  cmddesc_mute: 'Mutes a user',
  cmddesc_unmute: 'Delete user mutes',
  cmddesc_kick: 'Kicks a user',
  cmddesc_ban: 'Bans a user',
  cmddesc_unban: 'Unbans a user',
  commands: {
    moderation: {
      mute: {
        default_action_reason: ['None', 'Select a precific reason', 'Mute by reason', 'Select a reason from a list'],
        default_action_time: ['Select a specific time', 'Use reason time', 'Permanently mute']
      },
      kick: {
        default_action_reason: ['None', 'Select a precific reason', 'Kick by reason', 'Select a reason from a list']
      },
      ban: {
        default_action_reason: ['None', 'Select a precific reason', 'Ban by reason', 'Select a reason from a list'],
        default_action_time: ['Select a specific time', 'Use reason time', 'Permanently ban']
      }
    }
  },
  log: {
    t: {
      'xp': 'XP changed',
      'levels/xp/add': 'XP added',
      'levels/xp/sub': 'XP subtracted'
    }
  }
}

export const l = (k, {und = false, ...params} = {und: false}) => {
  const res = objectPath.get(en, k.split('/')) || (!und && `en__${k}`)
  return typeof res === 'function' ? res(params) : res
}