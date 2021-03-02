import { useSelector, useDispatch } from "react-redux"
import { cloneDeep, isEqual } from "lodash"
import { diff } from "deep-diff"
import axios from "axios"
import { store } from "./store"
import { notify } from "./components/notify"
import { generateId } from "./utils/generateId"
import { refreshToken } from './hooks/auth.hook'
import objectPath from "object-path"
import { emit } from "./hooks/connection.hook"

export const post = async events => {
  let prev = store.getState().guildPrev
  let current = store.getState().guild
  if (!prev) return
  let changes = diff(prev, current)
  if (!changes && !events) return
  store.dispatch({type: 'UPDATE_CNCT', data: {sync: true}})
  const storeState = store.getState()
  const res = await emit.update.guild({changes, events})
  if (res.status >= 400) {
    if (res.err === 'invalid_changes')
      notify.error({title: 'Invalid changes', text: 'Try reloading the page'})
  }
  console.log(res, changes, events)
  /*axios.post('/api/v1/update', {id: current.id, changes, events}, {headers: {authorization: 'Bearer ' + storeState.auth.token, user_id: storeState.auth.userId}, validateStatus: () => true})
    .then(async r => {
      console.log('CHANGES', changes, r, events)
      if (r.status === 200) {
        //notify.success({title: 'Saved'}, 5000)
      } else {
        if (r.status === 400)
          return notify.error({title: 'Invalid changes', text: 'Try reloading the page'})
        if (r.status === 401) {
          await refreshToken()
          return post(events)
        }
        notify.error({title: 'Changes not saved', text: 'Unknown error'})
      }
    })*/
}

const u = pn => {
  const fn = (cb, events) => {
    let pl = cloneDeep(store.getState().guild.plugins[pn]),
        ev = events ? events(pl) : null
    cb && cb(pl)
    store.dispatch({type: 'UPDATE_PLUGIN', pl: pn, data: pl})
    post(ev)
  }
  fn.arr = function (path) {
    return {
      add: n => this(pl => {
        let s = objectPath.get(pl, path) || []
        s.push(n)
        objectPath.set(pl, path, s)
      }),
      del: d => this(pl => {
        let s = objectPath.get(pl, path) || []
        s = s.filter((_, i) => i !== d)
        s.length ? objectPath.set(pl, path, s) : objectPath.del(pl, path)
      })
    }
  }
  return fn
}

const groupsUpdate = () => {
  const fn = (cb, events) => {
    let st = cloneDeep(store.getState().guild.groups),
        ev = events ? events(pl) : null
    cb(st)
    store.dispatch({type: 'UPDATE_GROUPS', data: st.filter(Boolean)})
    post(ev)
  }
  fn.arr = function (path) {
    return {
      add: n => this(pl => {
        let s = objectPath.get(pl, path) || []
        s.push(n)
        objectPath.set(pl, path, s)
      }),
      del: d => this(pl => {
        let s = objectPath.get(pl, path) || []
        s = s.filter((_, i) => i !== d)
        s.length ? objectPath.set(pl, path, s) : objectPath.del(pl, path)
      })
    }
  }
  return fn
}

const settingsUpdate = (cb, events) => {
  let st = cloneDeep(store.getState().guild.settings),
      ev = events ? events(pl) : null
  cb(st)
  store.dispatch({type: 'UPDATE_GUILD_SETTINGS', data: st})
  post(ev)
}

const membersUpdate = (cb, events) => {
  let mm = cloneDeep(store.getState().members),
      members = cloneDeep(store.getState().guild.members),
      ev = events ? events(mm) : null
  cb(mm, members)
  store.dispatch({type: 'SET_MEMBERS_CACHE', data: mm})
  store.dispatch({type: 'UPDATE_MEMBERS', data: members})
  post(ev)
}

const permissionsSelector = (u, path, {groups = true} = {}) => ({
  eroles: {
    add: n => u.arr([...path, 'eroles']).add(n),
    del: d => u.arr([...path, 'eroles']).del(d)
  },
  droles: {
    add: n => u.arr([...path, 'droles']).add(n),
    del: d => u.arr([...path, 'droles']).del(d)
  },
  echannels: {
    add: n => u.arr([...path, 'echannels']).add(n),
    del: d => u.arr([...path, 'echannels']).del(d)
  },
  dchannels: {
    add: n => u.arr([...path, 'dchannels']).add(n),
    del: d => u.arr([...path, 'dchannels']).del(d)
  },
  groups: groups && {
    add: n => u.arr([...path, 'groups']).add(n),
    del: d => u.arr([...path, 'groups']).del(d)
  }
})

const cmd = (u, cn) => ({
  enabled: {
    toggle: () => u(pl => pl.commands[cn].enabled = !pl.commands[cn].enabled)
  },
  ...permissionsSelector(u, ['commands', cn]),
  aliases: {
    add: n => n && u.arr(`commands.${cn}.aliases`).add(n),
    del: d => u.arr(`commands.${cn}.aliases`).del(d)
  },
  cd: {
    enabled: () => u(pl => pl.commands[cn].cd.enabled = !pl.commands[cn].cd.enabled),
    set: n => u(pl => pl.commands[cn].cd.v = n),
    setMode: n => u(pl => pl.commands[cn].cd.mode = n)
  },
  reply: {
    setReplyMsg: n => u(pl => pl.commands[cn].reply.msg = n),
    setMode: n => u(pl => pl.commands[cn].reply.mode = n)
  },
  defaultAction: {
    reason: {
      set: {
        a: n => u(pl => pl.commands[cn].defaultAction.reason.a = n),
        specific: n => u(pl => pl.commands[cn].defaultAction.reason.specific = n),
        reason: n => u(pl => pl.commands[cn].defaultAction.reason.reason = n)
      }
    },
    time: {
      set: {
        a: n => u(pl => pl.commands[cn].defaultAction.time.a = n),
        specific: n => u(pl => pl.commands[cn].defaultAction.time.specific = n),
        reason: n => u(pl => pl.commands[cn].defaultAction.time.reason = n)
      }
    }
  },
  deleteAfter: {
    req: {
      enabled: () => u(pl => pl.commands[cn].deleteAfter.req.enabled = !pl.commands[cn].deleteAfter.req.enabled),
      set: n => u(pl => pl.commands[cn].deleteAfter.req.v = n)
    },
    res: {
      enabled: () => u(pl => pl.commands[cn].deleteAfter.res.enabled = !pl.commands[cn].deleteAfter.res.enabled),
      set: n => u(pl => pl.commands[cn].deleteAfter.res.v = n)
    },
  }
})

const levels = u => ({
  voiceXPRate: {
    set: n => u(pl => pl.voiceXPRate = n)
  },
  textXPRate: {
    set: n => u(pl => pl.textXPRate = n)
  },
  msgTimeout: {
    set: n => u(pl => pl.msgTimeout = n)
  },
  type: {
    set: n => u(pl => pl.type = n)
  },
  setMode: n => u(pl => pl.levelsMode = n),
  rewards: {
    add: () => u(pl => pl.rewards.push({level: 0, roles: []})),
    delete: d => u(pl => pl.rewards = pl.rewards.filter((_, i) => i !== d)),
    setLevel: (i, n) => u(pl => pl.rewards[i].level = n),
    addRole: (i, n) => u(pl => pl.rewards[i].roles.push(n)),
    delRole: (i, d) => u(pl => pl.rewards[i].roles = pl.rewards[i].roles.filter((_, ii) => ii !== d))
  },
  disabledRoles: {
    add: n => u(pl => pl.disabledRoles.push(n)),
    del: d => u(pl => pl.disabledRoles = pl.disabledRoles.filter((_, i) => i !== d))
  },
  disabledChannels: {
    add: n => u(pl => pl.disabledChannels.push(n)),
    del: d => u(pl => pl.disabledChannels = pl.disabledChannels.filter((_, i) => i !== d))
  },
  card: {
    colors: {
      set: {
        text1: n => u(pl => pl.card.colors.text1 = n),
        text2: n => u(pl => pl.card.colors.text2 = n),
        text3: n => u(pl => pl.card.colors.text3 = n),
        text4: n => u(pl => pl.card.colors.text4 = n),
        xp: n => u(pl => pl.card.colors.xp = n),
        bg: n => u(pl => pl.card.colors.bg = n),
        bgname: n => u(pl => pl.card.colors.bgname = n),
        bgxp: n => u(pl => pl.card.colors.bgxp = n)
      }
    }
  },
  cmds: {
    rank: cmd(u, 'rank'),
    addxp: cmd(u, 'addxp')
  }
})

const moderation = u => ({
  reasons: {
    mute: {
      add: () => u(pl => pl.reasons.mute.push({
        id: generateId(pl.reasons.mute.map(a => a.id)),
        reason: '',
        time: {
          text: {
            enabled: false,
            timeout: 0
          },
          voice: {
            enabled: false,
            timeout: 0
          }
        }
      })),
      setReason: (i, n) => u(pl => pl.reasons.mute[i].reason = n),
      setTimeText: (i, n) => u(pl => pl.reasons.mute[i].time.text = n),
      setTimeVoice: (i, n) => u(pl => pl.reasons.mute[i].time.voice = n),
      del: d => u(pl => pl.reasons.mute = pl.reasons.mute.filter((_, i) => i !== d))
    },
    kick: {
      add: () => u(pl => pl.reasons.kick.push({
        id: generateId(pl.reasons.kick.map(a => a.id)),
        reason: ''
      })),
      setReason: (i, n) => u(pl => pl.reasons.kick[i].reason = n),
      del: d => u(pl => pl.reasons.kick = pl.reasons.kick.filter((_, i) => i !== d))
    },
    ban: {
      add: () => u(pl => pl.reasons.ban.push({
        id: generateId(pl.reasons.ban.map(a => a.id)),
        reason: '',
        time: 0
      })),
      setReason: (i, n) => u(pl => pl.reasons.ban[i].reason = n),
      setBanTime: (i, n) => u(pl => pl.reasons.ban[i].time = n),
      del: d => u(pl => pl.reasons.ban = pl.reasons.ban.filter((_, i) => i !== d))
    }
  },
  cmds: {
    clear: cmd(u, 'clear'),
    warn: cmd(u, 'warn'),
    unwarn: cmd(u, 'unwarn'),
    mute: cmd(u, 'mute'),
    unmute: cmd(u, 'unmute'),
    kick: cmd(u, 'kick'),
    ban: cmd(u, 'ban'),
    unban: cmd(u, 'unban')
  }
})

const filtersItem = (u, f) => ({
  enabled: n => u(pl => pl.filters[f].enabled = n),
  setWarns: n => u(pl => pl.filters[f].warns = n),
  setMuteTimeText: n => u(pl => pl.filters[f].muteTime.text = n),
  setMuteTimeVoice: n => u(pl => pl.filters[f].muteTime.voice = n),
  setDelMsg: n => u(pl => pl.filters[f].delMsg = n),
  ...permissionsSelector(u, ['filters', f])
})
const automod = u => ({
  filters: {
    spam: {
      ...filtersItem(u, 'spam'),
      setMessages: n => u(pl => pl.filters.spam.messages = n),
      setResetTime: n => u(pl => pl.filters.spam.reset = n)
    },
    repeatedMessages: {
      ...filtersItem(u, 'repeatedMessages'),
      setMessages: n => u(pl => pl.filters.repeatedMessages.messages = n),
      setResetTime: n => u(pl => pl.filters.repeatedMessages.reset = n)
    },
    caps: {
      ...filtersItem(u, 'caps'),
      setThreshold: n => u(pl => pl.filters.caps.threshold = n),
      setMinLength: n => u(pl => pl.filters.caps.minLength = n)
    },
    emoji: {
      ...filtersItem(u, 'emoji'),
      setThreshold: n => u(pl => pl.filters.emoji.threshold = n),
      setMinLength: n => u(pl => pl.filters.caps.minLength = n)
    },
    links: {
      ...filtersItem(u, 'links'),
      allowedDomains: {
        add: n => u.arr('filters.links.allowedDomains').add(n),
        del: d => u.arr('filters.links.allowedDomains').del(d)
      }
    },
    zalgo: {
      ...filtersItem(u, 'zalgo'),
      setThreshold: n => u(pl => pl.filters.zalgo.threshold = n)
    }
  },
  autoActions: {
    create: () => u(pl => pl.autoActions.push({
      id: generateId(pl.autoActions.map(a => a.id)),
      warns: 0,
      reset: 3600000,
      action: 'none'
    })),
    setWarns: (i, n) => u(pl => pl.autoActions[i].warns = n),
    setResetTime: (i, n) => u(pl => pl.autoActions[i].reset = n),
    setAction: (i, n) => u(pl => {
      pl.autoActions[i].action = n
      if (n === 'mute')
        pl.autoActions[i].muteTime = {text: 0, voice: 0}
      else if (n === 'ban')
        pl.autoActions[i].ban = {type: 'none'}
    }),
    setMuteTime: {
      text: (i, n) => u(pl => pl.autoActions[i].muteTime.text = n),
      voice: (i, n) => u(pl => pl.autoActions[i].muteTime.voice = n)
    },
    setKick: (i, n) => u(pl => pl.autoActions[i].kick = n),
    setBanType: (i, n) => u(pl => {
      pl.autoActions[i].ban.type = n
      if (n === 'time')
        pl.autoActions[i].ban.time = 0
      else if (n === 'reason')
        pl.autoActions[i].ban.reason = null
    }),
    setBanReason: (i, n) => u(pl => pl.autoActions[i].ban.reason = n),
    setBanTime: (i, n) => u(pl => pl.autoActions[i].ban.time = n),
    del: d => u(pl => pl.autoActions = pl.autoActions.filter((_, i) => i !== d))
  }
})

const reactionRoles = u => ({
  add: () => u(pl => pl.d.push({id: generateId(pl.d.map(ms => ms.id)), channel: null, msg: '', msgId: null, reacts: []})),
  setChannel: (i, n) => u(pl => pl.d[i].channel = n, pl => [{action: 'RRSetMsg', v: pl.d[i].id}]),
  setMsgContent: (i, n) => u(pl => pl.d[i].msg.content = n, pl => [{action: 'RRSetMsg', v: pl.d[i].id}]),
  addReact: i => u(pl => pl.d[i].reacts.push({emoji: null, roles: []}), pl => [{action: 'RREditReacts', v: pl.d[i].id}]),
  setEmoji: (i, ii, n) => u(pl => pl.d[i].reacts[ii].emoji = n, pl => [{action: 'RREditReacts', v: pl.d[i].id}]),
  addRole: (i, ii, n) => u(pl => pl.d[i].reacts[ii].roles.push(n), pl => [{action: 'RRAddRoles', v: {id: pl.d[i].id, roles: [n]}}]),
  delRole: (i, ii, d) => u(pl => pl.d[i].reacts[ii].roles = pl.d[i].reacts[ii].roles.filter((_, iii) => iii !== d), pl => [{action: 'RRDeleteRoles', v: {id: pl.d[i].id, roles: [pl.d[i].reacts[ii].roles[d]]}}]),
  delReact: (i, d) => u(pl => pl.d[i].reacts = pl.d[i].reacts.filter((_, ii) => ii !== d), pl => [{action: 'RREditReacts', v: pl.d[i].id}, {action: 'RRDeleteRoles', v: {id: pl.d[i].id, roles: pl.d[i].reacts[d].roles}}]),
  del: (d, delMsg) => u(pl => pl.d = pl.d.filter((_, i) => i !== d), pl => delMsg && [{action: 'reactionRoles/delete', v: pl.d[d].id}])
})

const music = u => ({
  setChannel: n => u(pl => pl.channel = n, () => [{action: 'music/channel'}]),
  play: n => u(null, () => [{action: 'play', v: n}]),
  playpause: () => u(pl => pl.resumed = !pl.resumed, pl => [{action: pl.resumed ? 'pause' : 'resume'}]),
  skip: () => u(pl => pl.repeat && pl.queue.shift(), () => [{action: 'skip'}]),
  repeat: () => u(pl => pl.repeat = !pl.repeat),
  volume: n => u(pl => pl.volume = n, () => [{action: 'volume'}]),
  queue: {
    del: d => u(pl => pl.queue = pl.queue.filter((_, i) => i !== d))
  },
  cmds: {
    play: cmd(u, 'play'),
    playnow: cmd(u, 'playnow'),
    skip: cmd(u, 'skip'),
    pause: cmd(u, 'pause'),
    stop: cmd(u, 'stop'),
    repeat: cmd(u, 'repeat'),
    np: cmd(u, 'np'),
    queue: cmd(u, 'queue'),
    cqueue: cmd(u, 'cqueue'),
    volume: cmd(u, 'volume'),
    join: cmd(u, 'join'),
    leave: cmd(u, 'leave')
  }
})

const welcome = u => ({
  toChannel: {
    toggle: {
      enabled: n => u(pl => pl.toChannel = n ? {enabled: true, msg: {content: ''}} : {enabled: false})
    },
    set: {
      channel: n => u(pl => pl.toChannel.channel = n),
      msg: n => u(pl => pl.toChannel.msg.content = n),
    }
  },
  private: {
    toggle: {
      enabled: n => u(pl => pl.private = n ? {enabled: true, msg: {content: ''}} : {enabled: false})
    },
    set: {
      msg: n => u(pl => pl.private.msg.content = n)
    }
  },
  roles: {
    add: n => u(pl => pl.roles.push(n)),
    del: d => u(pl => pl.roles = pl.roles.filter((_, i) => i !== d))
  }
})

const counters = u => ({
  create: () => u(pl => pl.d.push({id: generateId(pl.d.map(c => c.id)), category: 0, type: 0, name: '', channel: null, role: null, ids: []})),
  counter: i => ({
    upd: () => u(null, pl => [{action: 'CUpdate', v: pl.d[i].id}]),
    set: {
      category: n => u(pl => pl.d[i].category = n, pl => [{action: 'CUpdate', v: pl.d[i].id}]),
      type: n => u(pl => pl.d[i].type = n, pl => [{action: 'CUpdate', v: pl.d[i].id}]),
      role: n => u(pl => pl.d[i].role = n, pl => [{action: 'CUpdate', v: pl.d[i].id}]),
      name: n => u(pl => pl.d[i].name = n, pl => [{action: 'CUpdate', v: pl.d[i].id}])
    },
    del: delChannel => u(pl => pl.d = pl.d.filter((_, ii) => ii !== i), pl => delChannel && [{action: 'counters/delete', v: pl.d[i].id}])
  })
})

const poll = u => ({
  setDuration: n => u(pl => pl.duration = n),
  cmds: {
    poll: cmd(u, 'poll')
  }
})

const alerts = u => ({
  enabled: {toggle: () => u(pl => pl.enabled = !pl.enabled, () => [{action: 'alerts'}])},
  add: () => u(pl => pl.d.push({id: generateId(pl.d.map(al => al.id)), platform: 'twitch', sub: null, msg: {type: 0, content: ''}})),
  setPlatform: (i, n) => u(pl => pl.d[i].platform = n, pl => [{action: 'alerts', v: [pl.d[i].id]}]),
  setSub: (i, n) => u(pl => pl.d[i].sub = n, pl => [{action: 'alerts', v: [pl.d[i].id]}]),
  setChannelId: (i, n) => u(pl => pl.d[i].channelId = n),
  setMsgType: (i, n) => u(pl => pl.d[i].msg.type = n),
  setMsgContent: (i, n) => u(pl => pl.d[i].msg.content = n),
  del: d => u(pl => pl.d = pl.d.filter((_, i) => i !== d), () => [{action: 'alerts'}])
})

const userRooms = u => ({
  setCategory: n => u(pl => pl.category = n, pl => [{action: 'URChannel'}]),
  setAddName: n => u(pl => pl.addName = n, pl => n && pl.category && [{action: 'URChannel'}]),
  setDeleteAfter: n => u(pl => pl.deleteAfter = n)
})

const plugins = {levels, moderation, automod, alerts, reactionRoles, music, welcome, counters, poll, userRooms}

export const pluginApi = pn => ({enabled: {toggle: () => u(pn)(pl => pl.enabled = !pl.enabled)}, ...(plugins[pn] ? plugins[pn](u(pn)) : () => {})})

export const groupsApi = (u => ({
  add: () => u(grps => grps.push({id: generateId(grps.map(g => g.id)), name: 'New group', enabledRoles: [], disabledRoles: [], enabledChannels: [], disabledChannels: []})),
  group: i => ({
    setName: n => u(grps => grps[i].name = n || 'Group'),
    roles: {
      add: n => u.arr([i, 'roles']).add(n),
      del: d => u.arr([i, 'roles']).del(d)
    },
    channels: {
      add: n => u.arr([i, 'channels']).add(n),
      del: d => u.arr([i, 'channels']).del(d)
    }
  }),
  del: d => u(grps => delete grps[d])
}))(groupsUpdate())

export const settingsApi = (u => ({
  prefix: n => u(stgs => stgs.prefix = n),
  setLanguage: n => u(stgs => stgs.language = n),
  admRoles: {
    add: n => u(stgs => stgs.admRoles.push(n)),
    del: d => u(stgs => stgs.admRoles= stgs.admRoles.filter((_, i) => i !== d))
  },
  toggle: {
    nopermRole: n => u(stgs => stgs.nopermRole = n),
    nopermChannel: n => u(stgs => stgs.nopermChannel = n),
    border: n => u(stgs => stgs.border = n)
  },
  set: {
    responseDesign: n => u(stgs => stgs.responseDesign = n.o)
  }
}))(settingsUpdate)

export const membersApi = (u => ({
  member: m => ({
    set: {
      XP: n => u((mm, members) => members.levels[m] = n)
    }
  })
}))(membersUpdate)