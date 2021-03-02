import React, { memo, useRef } from 'react'
import cn from 'classnames'
import { Scroll } from './scroll'

import st from './dropdownList.sass'

const DropdownListItem = memo(({selected, name, set, click, close}) => {
  const ref = useRef()
  return <div className={cn(st.el, {selected})} onClick={e => {
    if (click) {
      click(e, ref.current)
      return close()
    }
    set()
    close()
  }} ref={ref}>
    {name}
  </div>
})

export const DropdownList = ({visible, list, close}) => {
  return <div className={cn(st.dropdownlist, {visible})}>
  <Scroll deps={[visible, list]}>
    <div className={st.dropdownlistInner}>{list.map((el, i) => <DropdownListItem selected={el.selected} name={el.name} set={el.set} click={el.click} close={close} key={el.id || i} />)}</div>
  </Scroll>
</div>
}