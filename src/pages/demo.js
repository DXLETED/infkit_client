import React, { useState, useEffect } from 'react'
import { Dashboard } from './dashboard'
import Axios from 'axios'
import { useDispatch } from 'react-redux'

export const Demo = props => {
  const dispatch = useDispatch()
  const [state, setState] = useState()
  const [cn, setCN] = useState({active: false, limited: false, lastUpdate: 0, sync: false})
  useEffect(() => {
    Axios.get('/api/v1/demo')
      .then(res => {
        dispatch({type: 'UPDATE_GUILD', data: res.data})
        setState(res.data)
      })
  }, [])
  return <Dashboard state={state} updateState={setState} cn={cn} path="/demo" demo />
}