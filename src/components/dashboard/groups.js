import React, { useState, useRef, useEffect, useMemo } from 'react'
import cn from 'classnames'
import { EditableList } from '../editableList'
import { Modal } from '../modal'
import { ObjectEdit } from '../objectEdit'
import { Scroll } from '../scroll'
import { useModal } from '../../hooks/useModal'
import { useSelector } from 'react-redux'
import { groupsApi } from '../../api'
import { Input } from '../input'
import { isEqual } from 'lodash'
import { Container } from '../container'

import st from './Groups.sass'

const Group = ({g, api}) => {
  const [modalState, open, close] = useModal({fixed: true})
  return <div className={st.group}>
    <div className={st.name} onClick={open}>{g.name}</div>
    <Modal
    className="ml"
    s={modalState}
    title={<Input className={st.groupName} value={g.name} set={api.setName} p fill black bold />}
    footer={<div className={st.remove} onClick={() => api.del()}><img src="/static/img/remove.png" />REMOVE</div>}>
      <ObjectEdit label="Roles" type="roles" data={g.roles}
        add={api.roles.add}
        delete={api.roles.del} isGroup m noML />
      <ObjectEdit label="Channels" type="channels" data={g.channels}
        add={api.channels.add}
        delete={api.channels.del} isGroup noML />
    </Modal>
  </div>
}

export const Groups = ({open, setOpen}) => {
  const state = useSelector(s => s.guild && s.guild.config.groups, isEqual),
        api   = useMemo(() => groupsApi, [])
  const [addName, setAddName] = useState('')
  return (
    <div className={cn(st.groups, {[st.open]: open})}>
      <div className={st.label} onClick={() => setOpen(!open)}><div className={st.labelInner}><img src="/static/img/side/groups.png" />Groups</div><img src={open ? '/static/img/arrow/top.png' : '/static/img/arrow/bottom.png'} /></div>
        {open && 
          <div className={st.dropdown}>
            <Scroll className={st.list} deps={[state]} pl>
              {state ? state.map((g, i) => <Group g={g} api={api.group(i)} key={i} />) : <></>}
              <div className={st.add}>
                <Input set={setAddName} placeholder="Group name" clear={state?.length} fill />
                <div className={st.btn} onClick={() => api.add(addName)}>CREATE</div>
              </div>
            </Scroll>
          </div>}
    </div>
  )
}