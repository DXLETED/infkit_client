import Axios from 'axios'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router'
import qs from 'qs'
import { useDispatch } from 'react-redux'

export const Login = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  useEffect(() => {
    console.log(qs.parse(location.search, { ignoreQueryPrefix: true }))
    Axios.post('/api/v1/auth/login', {code: qs.parse(location.search, { ignoreQueryPrefix: true }).code})
      .then(res => {
        if (res.status === 200) {
          dispatch({type: 'UPDATE_AUTH', data: {userId: res.data.userId, token: res.data.token}})
          dispatch({type: 'UPDATE_USER', data: res.data.user})
          localStorage.getItem('authorized') && localStorage.removeItem('authorized')
          localStorage.setItem('authorized', true)
        }
        window.close()
      })
  }, [])
  return <></>
}