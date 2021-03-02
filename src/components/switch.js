import cn from 'classnames'
import React, { useState } from 'react'

import st from './Switch.sass'

export const Switch = props => <div className={cn(st.switch, props.className, {[st.enabled]: props.enabled, m: props.m, p: props.p, flex: props.flex})} onClick={() => props.set?.(!props.enabled)}><div className={st.status} />{props.children}</div>

export const SwitchEl = props => <div className={cn('switchel', props.className, {enabled: props.enabled})}><div className="sw-enabled">{props.enabled ? <img /> : <img />}</div></div>