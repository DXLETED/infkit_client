import React from 'react'
import cn from 'classnames'
import { Icon } from './icon'

export const User = ({img, name, className, m, bg}) => <div className={cn('user', className, {m})}>
  <Icon src={img} alt={name + '_icon'} nobg={bg !== undefined && !!bg} />
  <div className="user-name">{name}</div>
</div>