import React from 'react'
import { useSelector } from 'react-redux'
import { isEqual } from 'lodash'

const sel = path => useSelector(path, isEqual)

export const useGuild = {
  roles: () => {
    let list = sel(s => s.guild.server.roles).sort((x, y) => x.rawPosition > y.rawPosition ? 1 : -1).sort((x, y) => x.type > y.type ? 1 : -1)
    return {list, get: id => list.find(el => el.id == id) || {}}
  },
  channels: () => {
    let list = sel(s => s.guild.server.channels).sort((x, y) => x.rawPosition < y.rawPosition ? 1 : -1).sort((x, y) => x.type > y.type ? 1 : -1)
    return {
      list,
      get: id => list.find(el => el.id == id) || {},
      text: list.filter(el => el.type === 'text'),
      voice: list.filter(el => el.type === 'voice'),
      categories: list.filter(el => el.type === 'category')
    }
  },
  groups: () => {
    let list = sel(s => s.guild.groups)
    return {list, get: id => list.find(el => el.id == id) || {}}
  },
  reasons: {
    mute: () => {
      let list = sel(s => s.guild.plugins.moderation.reasons.mute)
      return {list, get: id => list.find(el => el.id == id) || {}}
    },
    kick: () => {
      let list = sel(s => s.guild.plugins.moderation.reasons.kick)
      return {list, get: id => list.find(el => el.id == id) || {}}
    },
    ban: () => {
      let list = sel(s => s.guild.plugins.moderation.reasons.ban)
      return {list, get: id => list.find(el => el.id == id) || {}}
    }
  }
}