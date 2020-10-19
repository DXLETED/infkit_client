import React from 'react'
import { vh } from './cssVar'

export const Fill = ({children, p, onClick}) => <div className="fill" onClick={onClick} style={{padding: p && vh(p)}}>{children}</div>