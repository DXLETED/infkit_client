import React from 'react'
import { Select } from '../components/select'
import { Input } from '../components/input'
import { MultiSwitch } from '../components/multiSwitch'
import { Row } from '../components/row'
import { CustomTime } from '../components/customTime'
import { Category } from '../components/Category'

export const UserRooms = ({state, api, layout}) => <>
  <Category>
    <Select label="Category" type="category" selected={state.category} add={[{id: null, name: 'Category not selected'}, {id: '000000', name: '<root>'}]} set={api.setCategory} required m />
    <Row elements={[
      <Input label="CREATE CHANNEL name" value={state.addName} set={api.setAddName} defsize p b />,
      <CustomTime label="Delete after" value={state.deleteAfter.v} set={api.setDeleteAfter} defsize />
    ]} column={layout.ap2} />
  </Category>
</>