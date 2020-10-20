import objectPath from "object-path"

let en = {
  plugin_moderation: 'Moderation',
  plugin_automod: 'Automod',
  plugin_levels: 'Levels',
  plugin_welcome: 'Welcome',
  plugin_reactionRoles: 'Reaction Roles',
  plugin_music: 'Music',
  plugin_userRooms: 'User rooms',
  plugin_counters: 'Counters',
  plugin_poll: 'Poll',
  plugin_alerts: 'Twitch alerts',
  plugindesc_levels: 'Highlight seasoned participants / Reward the olds',
  plugindesc_moderation: 'Easy-to-use management of your server',
  plugindesc_automod: '???????',
  plugindesc_reactionRoles: 'Allow your members to get roles by responding to a message',
  plugindesc_welcome: 'Customize your welcome image / text',
  plugindesc_counters: 'Server stats',
  plugindesc_alerts: 'Instant notifications about streams',
  plugindesc_music: 'Control high quality music right from the app',
  plugindesc_poll: 'Finally, decide what to play',
  plugindesc_userRooms: 'User-configurable channels',
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
  }
}

export const l = (k, und) => objectPath.get(en, k.split('/')) || (!und && `en__${k}`)