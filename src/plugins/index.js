import React from 'react'
import { Levels } from './levels'
import { Moderation } from './moderation'
import { Music } from './music'
import { reactionRoles } from './reactionRoles'
import { Counters } from './counters'
import { Poll } from './poll'
import { Welcome } from './welcome'
import { UserRooms } from './userRooms'
import { Alerts } from './alerts'
import { Automod } from './automod'

export const plugins = {
  levels: Levels,
  moderation: Moderation,
  automod: Automod,
  reactionRoles: reactionRoles,
  music: Music,
  welcome: Welcome,
  counters: Counters,
  poll: Poll,
  userRooms: UserRooms,
  alerts: Alerts
}