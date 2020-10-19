import objectPath from "object-path"

export const config = {
  clientId: '722448416575062016',
  url: 'https://powerful-emphasized-nova.glitch.me/',
  get: function (path) { return objectPath.get(this, path.split('/')) },
  commands: {
    moderation: {
      mute: {
        default_action_reason: ['none', 'specific', 'reason', 'list'],
        default_action_time: ['specific', 'reason', 'permanently']
      },
      kick: {
        default_action_reason: ['none', 'specific', 'reason', 'list']
      },
      ban: {
        default_action_reason: ['none', 'specific', 'reason', 'list'],
        default_action_time: ['specific', 'reason', 'permanently']
      }
    }
  }
}