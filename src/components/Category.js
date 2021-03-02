import React from 'react'
import { CategoryName } from './categoryName'
import cn from 'classnames'

import st from './Category.sass'

export const Category = ({title, dashboard, children}) => <div className={cn(st.category, {[st.dashboard]: dashboard})}>
  <CategoryName>{title}</CategoryName>
  {children}
</div>