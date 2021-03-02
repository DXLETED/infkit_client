import React from 'react'
import { Select } from '../components/select'
import { Input } from '../components/input'
import { MultiSwitch } from '../components/multiSwitch'

export const UserRooms = props => {
  const { state, api } = props
  return (
    <>
      <Select label="Category" type="category" selected={state.category} add={[{id: null, name: 'Category not selected'}, {id: '000000', name: '<root>'}]} set={api.setCategory} required m />
      <Input label="CREATE CHANNEL name" value={state.addName} set={api.setAddName} defsize p m b />
      <MultiSwitch label="Delete after" type="time" selected={state.deleteAfter} options={['0s', '5s', '15s', '1m', '5m']} set={api.setDeleteAfter} custom />
    </>
  )
}