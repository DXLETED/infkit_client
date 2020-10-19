import React from 'react'
import cn from 'classnames'

export const Icon = ({ src, alt, nobg }) => <div className={cn('icon', {'icon-no-bg': nobg})}>
  {src
    ? <img src={src} alt={alt} />
    : (alt ? alt.split(' ').length <= 1 ? alt.split(' ')[0][0] : alt.split(' ')[0][0] + alt.split(' ')[1][0] : '')}
</div>