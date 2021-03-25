import React from 'react'
import { CategoryName } from './categoryName'
import cn from 'classnames'

import st from './Category.sass'

export const Category = ({title, dashboard, children, order}) => <div className={cn(st.category, {[st.dashboard]: dashboard})}>
  {title && <div className={st.categoryName}>
    <div className={st.border} />
    <div className={st.inner}>{title}</div>
  </div>}
  <div className={cn(st.inner, {[st.animate]: order !== undefined})} style={{animationDelay: `${order * 0.1}s`}}>{children}</div>
</div>