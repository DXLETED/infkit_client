import React from 'react'
import cn from 'classnames'
import { memo } from 'react'

export const FeaturesPreviewItem = ({name, color, indev}) => <div className={cn('features-preview__item', {indev})}>
  {indev ? <s>{name}</s> : name}
  <div className="features-preview__item__border" style={{background: color}} />
</div>

export const FeaturesItem = memo(({title, text, src, color, reversed = false} = {}) => <div className={cn('features__item', {reversed})}>
  <img src={src} />
  <div className="features__item__d">
    <div className="features__item__d__title" style={{borderColor: color}}>{title}</div>
    <div className="features__item__d__line" style={{background: color}} />
    <div className="features__item__d__text">{text}</div>
  </div>
</div>)