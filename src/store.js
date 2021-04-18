import { createStore } from 'redux'
import { storeSync } from './components/storeSync'

const initialState = {
  auth: {},
  user: {},
  settings: {},
  ntfs: [],
  cnct: {active: false, sync: false, limited: false},
  modals: [],
  menus: [],
  members: [],
  membersCache: {},
  membersLoaded: false,
  channels: {
    twitch: {}
  },
  timesync: 0
}

function todos(state = {}, action) {
  switch (action.type) {
    case 'UPDATE_SETTINGS':
      return {...state, settings: {...state.settings, ...action.data}}
    case 'UPDATE_AUTH':
      return {...state, auth: action.data}
    case 'UPDATE_AUTHORIZED':
      return {...state, authorized: action.data}
    case 'UPDATE_USER':
      return {...state, user: action.data}
    case 'UPDATE_GUILDS':
      return {...state, guilds: action.data}
    case 'SELECTED_GUILD':
      return {...state, selectedGuild: action.data}
    case 'UPDATE_GUILD':
      return {...state, guild: {...state.guild || {}, ...action.data}}
    case 'SAVE_GUILD':
      return {...state, guildPrev: {...state.guild || {}, ...action.data}}
    case 'CLEAR_GUILD':
      return {...state, guild: null, guildPrev: null}
    case 'UPDATE_PLUGIN':
      return {...state, guild: {...state.guild, plugins: {...state.guild.plugins, [action.pl]: action.data}}}
    case 'UPDATE_GROUPS':
      return {...state, guild: {...state.guild, groups: action.data}}
    case 'UPDATE_GUILD_SERVER':
      return {...state, guild: {...state.guild, server: action.data}}
    case 'UPDATE_GUILD_STATS':
      return {...state, guild: {...state.guild, stats: action.data}}
    case 'UPDATE_GUILD_SETTINGS':
      return {...state, guild: {...state.guild, settings: action.data}}
    case 'SET_TIMESYNC':
      return {...state, timesync: action.data}
    case 'UPDATE_CNCT':
      return {...state, cnct: {...state.cnct, ...action.data}}
    case 'SET_MEMBERS':
      return {...state, members: action.data}
    case 'SET_MEMBERS_LOADED':
      return {...state, membersLoaded: action.data}
    case 'UPDATE_MEMBERS_CACHE':
      return {...state, membersCache: {...state.membersCache, ...action.data}}
    case 'UPDATE_MEMBERS':
      return {...state, guild: {...state.guild, members: action.data}}
    case 'SET':
      return {...state, ...action.data}
    case 'NEW_NOTIFY':
      return {...state, ntfs: [...state.ntfs, action.data]}
    case 'DEL_NOTIFY':
      return {...state, ntfs: state.ntfs.filter(ntf => ntf.id !== action.id)}
    case 'SETTINGS_KEY':
      return {...state, settings: {...state.settings, [action.key]: action.data}}
    case 'SET_CHANNEL_TWITCH':
      return {...state, channels: {...state.channels, twitch: {...state.channels.twitch, [action.id]: action.data}}}
    case 'MENU_OPEN':
      return {...state, menus: {...state.menus, [action.data]: true}}
    case 'MENU_CLOSE':
      return {...state, menus: {...state.menus, [action.data]: false}}
    case 'guild/init':
      return {...state, guild: action.data}
    case 'guild/update/plugin':
      return {...state, guild: {...state.guild, config: {...state.guild.config, plugins: {...state.guild.config.plugins, [action.plugin]: action.data}}}}
    case 'guild/update/settings':
      return {...state, guild: {...state.guild, config: {...state.guild.config, settings: action.data}}}
    case 'guild/update/permissions':
      return {...state, guild: {...state.guild, config: {...state.guild.config, permissions: action.data}}}
    case 'guild/update/groups':
      return {...state, guild: {...state.guild, config: {...state.guild.config, groups: action.data}}}
    case 'guild/update/roles':
      return {...state, guild: {...state.guild, roles: action.data}}
    case 'guild/update/channels':
      return {...state, guild: {...state.guild, channels: action.data}}
    case 'guild/update/state':
      return {...state, guild: {...state.guild, state: {...state.guild.state, [action.t]: action.data}}}
    case 'guild/update/members':
      return {...state, guild: {...state.guild, members: action.data}}
    case 'guild/update/member':
      return {...state, guild: {...state.guild, members: {...state.guild.members, list: state.guild.members.list.find(m => m.id === action.id)
        ? state.guild.members.list.map(m => m.id === action.id ? action.data : m)
        : [...state.guild.members.list, action.data]
      }}}
    default:
      return state
  }
}

const store = createStore(todos, initialState, window.__REDUX_DEVTOOLS_EXTENSION__?.())

storeSync(store, ['settings', 'auth'])

export { store }