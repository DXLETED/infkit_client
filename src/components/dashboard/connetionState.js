import React from 'react'
import { useSelector } from 'react-redux'
import { colors } from '../colorlist'

export const ConnectionState = () => {
  const cn = useSelector(s => s.cnct)
  const color = cn.active ? cn.cync ? colors.yellow : colors.green : colors.red
  return <div className="connection-state" style={{ borderColor: color }}>
    <img src={`/static/img/cn/${cn.active ? cn.sync ? 'sync' : 'connected' : 'syncerror'}.png`} />
    <div className="connection-state__bg" style={{ background: color }} />
  </div>
}