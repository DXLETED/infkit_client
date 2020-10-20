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
    <Modal className="ml" s={modalState} title={<Input className="groupName" value={g.name} set={api.setName} fill black bold />}>
      <ObjectEdit type="roles" data={g.eroles}
        add={api.eroles.add}
        delete={api.eroles.del}
        default="ALL by default" label="Enabled roles" m noML />
      <ObjectEdit type="roles" data={g.droles}
        add={api.droles.add}
        delete={api.droles.del}
        label="Disabled roles" m noML />
      <ObjectEdit type="channels" data={g.echannels}
        add={api.echannels.add}
        delete={api.echannels.del}
        default="ANY by default" label="Enabled channels" m noML />
      <ObjectEdit type="channels" data={g.dchannels}
        add={api.dchannels.add}
        delete={api.dchannels.del}
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
                <EditableList data={state ? state.map((g, i) => ({fixed: !!g.type, img: g.type && '/static/img/lock.png', el: <Group g={g} i={i} api={api.group(i)} key={g.id} />})) : []}
                  delete={d => {
                    api.del(d)
                    setEdit(null)
                  }}
                  add={api.add} cpointer />
              </div>
            </Scroll>
          </div>}
    </div>
  )
}