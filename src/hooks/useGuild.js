import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { isEqual } from 'lodash'
import { useConnection } from './connection.hook'

const sel = path => useSelector(path, isEqual)

const membersRequested = []

export const useGuild = {
  roles: () => {
    let list = sel(s => s.guild.roles).sort((x, y) => x.rawPosition > y.rawPosition ? 1 : -1).sort((x, y) => x.type > y.type ? 1 : -1)
    return {list, get: id => list.find(el => el.id == id) || {}}
  },
  channels: () => {
    let list = sel(s => s.guild.channels).sort((x, y) => x.rawPosition < y.rawPosition ? 1 : -1).sort((x, y) => x.type > y.type ? 1 : -1)
    return {
      list,
      get: id => list.find(el => el.id == id) || {},
      text: list.filter(el => el.type === 'text'),
      voice: list.filter(el => el.type === 'voice'),
      categories: list.filter(el => el.type === 'category')
    }
  },
  groups: () => {
    let list = sel(s => s.guild.config.groups)
    return {list, get: id => list.find(el => el.id == id) || {}}
  },
  reasons: {
    mute: () => {
      let list = sel(s => s.guild.config.plugins.moderation.reasons.mute)
      return {list, get: id => list.find(el => el.id == id) || {}}
    },
    kick: () => {
      let list = sel(s => s.guild.config.plugins.moderation.reasons.kick)
      return {list, get: id => list.find(el => el.id == id) || {}}
    },
    ban: () => {
      let list = sel(s => s.guild.config.plugins.moderation.reasons.ban)
      return {list, get: id => list.find(el => el.id == id) || {}}
    }
  },
  state: {
    members: {
      mutes: () => {
        let list = sel(s => s.guild.state.members)
        return {list, get: id => list[id]?.mutes || []}
      },
      warns: () => {
        let list = sel(s => s.guild.state.members)
        return {list, get: id => list[id]?.warns || []}
      },
      bans: () => {
        let list = sel(s => s.guild.state.members)
        return {list, get: id => list[id]?.bans || []}
      },
      xp: () => {
        let list = sel(s => s.guild.state.members)
        return {list, get: id => list[id]?.xp || 0}
      }
    }
  },
  members: ids => {
    const loaded = sel(s => s.guild.members.loaded),
          list = sel(s => s.guild.members.list),
          connection = useConnection()
    useEffect(() => { !loaded && ids && ids.map(id => {
      if (!membersRequested.includes(id)) {
        connection.req.member(id)
        delete membersRequested[id]
      }
    }) }, [ids])
    return {
      list,
      get: id => list.find(el => el.id === id) || {loading: !loaded}
    }
  },
  membersCache: () => {
    let list = sel(s => s.members)
    return {list, get: id => list.find(el => el.id === id) || {}}
  }
}