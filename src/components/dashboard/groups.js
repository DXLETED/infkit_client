import React, { useState, useRef, useEffect, useMemo } from 'react'
import cn from 'classnames'
import { EditableList } from '../editableList'
import { Modal } from '../modal'
import { ObjectEdit } from '../objectEdit'
import { Label } from '../label'
import { Scroll } from '../scroll'
import { useModal } from '../../hooks/useModal'
import { useSelector } from 'react-redux'
import { groupsApi } from '../../api'
import { Input } from '../input'
import { isEqual } from 'lodash'
import { Fill } from '../fill'
import { Container } from '../container'

import st from './side.sass'
import { useLayout } from '../../hooks/layout.hook'

const Group = ({g, i, api}) => {
  const [modalState, open, close] = useModal({fixed: true})
  return <>
    <Container onClick={e => !g.type && open(e)} hp2 vp1>{g.name}</Container>
    <Modal className="ml" s={modalState} title={<Input className={st.groupName} value={g.name} set={api.setName} p fill black bold />}>
      <ObjectEdit label="Roles" type="roles" data={g.roles}
        add={api.roles.add}
        delete={api.roles.del} isGroup m noML />
      <ObjectEdit label="Channels" type="channels" data={g.channels}
        add={api.channels.add}
        delete={api.channels.del} isGroup noML />
    </Modal>
  </>
}

export const Groups = ({open, setOpen}) => {
  const state   = useSelector(s => s.guild && s.guild.groups, isEqual),
        api     = useMemo(() => groupsApi, [])
  return (
    <div className={cn(st.el, 'groups', {[st.open]: open})}>
      <div className={st.label} onClick={() => setOpen(!open)}><div className={st.labelInner}><img src="/static/img/side/groups.png" />Groups</div><img src={open ? '/static/img/arrow/top.png' : '/static/img/arrow/bottom.png'} /></div>
        {open && 
          <div className={st.dropdown}>
            <Scroll deps={[state]} pl column>
              <EditableList data={state ? state.map((g, i) => ({fixed: !!g.type, img: g.type && '/static/img/lock.png', el: <Group g={g} i={i} api={api.group(i)} key={g.id} />})) : []}
                delete={d => {
                  api.del(d)
                }}
                add={api.add} cpointer hl />
            </Scroll>
          </div>}
    </div>
  )
}