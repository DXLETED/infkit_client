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

const Group = ({g, i, api}) => {
  const [modalState, open, close] = useModal({fixed: true})
  return <>
    <Container onClick={e => !g.type && open(e)} hp2 vp1>{g.name}</Container>
    <Modal className="ml" s={modalState} title={<Input className="groupName" value={g.name} set={n => api.setName(i, n)} fill black bold />}>
      <ObjectEdit type="roles" data={g.enabledRoles}
        add={n => api.enabledRoles.add(i, n)}
        delete={d => api.enabledRoles.del(i, d)}
        default="ALL by default" label="Enabled roles" m noML />
      <ObjectEdit type="roles" data={g.disabledRoles}
        add={n => api.disabledRoles.add(i, n)}
        delete={d => api.disabledRoles.del(i, d)}
        label="Disabled roles" m noML />
      <ObjectEdit type="channels" data={g.enabledChannels}
        add={n => api.enabledChannels.add(i, n)}
        delete={d => api.enabledChannels.del(i, d)}
        default="ANY by default" label="Enabled channels" m noML />
      <ObjectEdit type="channels" data={g.disabledChannels}
        add={n => api.disabledChannels.add(i, n)}
        delete={d => api.disabledChannels.del(i, d)}
        label="Disabled roles" noML />
    </Modal>
  </>
}

export const Groups = ({open, setOpen}) => {
  const state = useSelector(s => s.guild && s.guild.groups, isEqual),
        api   = useMemo(() => groupsApi, [])
  const [edit, setEdit] = useState(null)
  const [mState, mOpen, close] = useModal({fixed: true})
  return (
    <div className={cn('side__el', 'groups', {open})}>
      <div className="side__el__label" onClick={() => setOpen(!open)}><div className="side__el__label_in"><img src="/static/img/side/groups.png" />Groups</div><img src={open ? '/static/img/arrow/top.png' : '/static/img/arrow/bottom.png'} /></div>
        {open && 
          <div className="dropdown">
            <Scroll deps={[state]}>
              <div className="group-settings-list">
                <EditableList data={state ? state.map((g, i) => ({fixed: !!g.type, img: g.type && '/static/img/lock.png', el: <Group g={g} i={i} api={api} key={g.id} />})) : []}
                  delete={d => {
                    api.del(d)
                    setEdit(null)
                  }}
                  add={api.add} cpointer />
              </div>
            </Scroll>
          </div>}
        <Modal id="group-settings" className="ml" s={mState}>
          {edit !== null && edit in state && <>
            <Input className="groupName" value={state[edit].name} set={n => api.setName(edit, n)} />
            <ObjectEdit type="roles" data={state[edit].enabledRoles}
              add={n => api.enabledRoles.add(edit, n)}
              delete={d => api.enabledRoles.del(edit, d)}
              default="ALL by default" label="Enabled roles" m />
            <ObjectEdit type="roles" data={state[edit].disabledRoles}
              add={n => api.disabledRoles.add(edit, n)}
              delete={d => api.disabledRoles.del(edit, d)}
              label="Disabled roles" m />
            <ObjectEdit type="channels" data={state[edit].enabledChannels}
              add={n => api.enabledChannels.add(edit, n)}
              delete={d => api.enabledChannels.del(edit, d)}
              default="ANY by default" label="Enabled channels" m />
            <ObjectEdit type="channels" data={state[edit].disabledChannels}
              add={n => api.disabledChannels.add(edit, n)}
              delete={d => api.disabledChannels.del(edit, d)}
              label="Disabled roles" />
          </>}
        </Modal>
    </div>
  )
}