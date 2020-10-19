import React from 'react'
import { useHistory } from 'react-router'
import cn from 'classnames'
import { vh } from './cssVar'

export const EdgedButton = props => {
  let history = useHistory()
  const click = () => {
    props.onClick && props.onClick()
    if (props.to && props.to.includes('://'))
      return window.location = props.to
    props.to && history.push(props.to)
  }
  const statusClick = e => {
    props.updateState && props.updateState(!props.status)
    e.preventDefault()
    e.stopPropagation()
  }
  return (
    <div className={cn('button', props.className, {enabled: props.status || props.status === undefined, compact: props.compact, center: props.center})} onClick={click}>
      <div className="border" />
      <div className="button-label" style={{paddingLeft: props.status !== undefined ? vh(5) : vh(1)}}>
        {props.status !== undefined && <div className={cn('status')} onClick={statusClick} />}
        {props.children}
      </div>
    </div>
  )
}