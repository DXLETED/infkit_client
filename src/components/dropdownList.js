import React, { memo, useRef } from 'react'
import cn from 'classnames'
import { Scroll } from './scroll'

const DropdownListItem = memo(({selected, name, set, click, close}) => {
  const ref = useRef()
  return <div className={cn('dropdownlist__el', {selected})} onClick={e => {
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
  return <div className={cn('dropdownlist-wr', {visible})}>
  <Scroll deps={[visible, list]}>
    <div className="dropdownlist">{list.map((el, i) => <DropdownListItem selected={el.selected} name={el.name} set={el.set} click={el.click} close={close} key={el.id || i} />)}</div>
  </Scroll>
</div>
}