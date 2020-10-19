import cn from 'classnames'
import React, { useState } from 'react'

export const Switch = props => <div className={cn('switch', props.className, {enabled: props.enabled, m: props.m})} onClick={() => props.set && props.set(!props.enabled)}>{props.children}</div>

export const SwitchEl = props => <div className={cn('switchel', props.className, {enabled: props.enabled})}><div className="sw-enabled">{props.enabled ? <img /> : <img />}</div></div>