import React from 'react'
import { useHistory } from 'react-router'
import cn from 'classnames'
import { vh } from './cssVar'
import { Component } from './Component'

import st from './Button.sass'

export const Button = ({label, src, to, onClick, ...props}) => {
  const history = useHistory()
  const click = e => {
    onClick?.(e)
    to && history.push(to)
  }
  return <Component cln={st.button} onClick={click} {...props}><div className={st.img}><img src={src || '/static/img/arrow/right.png'} /></div><div className={st.label}>{label}</div></Component>
}

export const EdgedButton = props => {
  const history = useHistory()
  const click = e => {
    props.onClick && props.onClick(e)
    if (props.to && props.to.includes('://'))
      return window.location = props.to
    props.to && history.push(props.to)
  }
  const statusClick = e => {
    props.updateState && props.updateState(!props.status)
    e.preventDefault()
    e.stopPropagation()
  }
  return <div className={cn('button', props.className, {enabled: props.status || props.status === undefined, compact: props.compact, center: props.center, m: props.m})} onClick={click}>
    <div className="border" style={{borderColor: props.borderColor}} />
    <div className="button-label" style={{paddingLeft: props.status !== undefined ? vh(5) : props.center ? 0 : vh(1), borderColor: props.borderColor}}>
      {props.status !== undefined && <div className={cn('status')} onClick={statusClick} />}
      {props.children}
    </div>
  </div>
}