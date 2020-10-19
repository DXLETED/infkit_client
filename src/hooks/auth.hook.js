import Axios from 'axios'
import { useSelector } from 'react-redux'
import { store } from '../store'

const getGuilds = async () => {
  const auth = store.getState().auth
  let r = await Axios.get('/api/v1/auth/guilds', {headers: {authorization: 'Bearer ' + auth.token, user_id: auth.userId}, validateStatus: () => true})
  console.log(r)
  if (r.status === 200)
    store.dispatch({type: 'UPDATE_GUILDS', data: r.data})
}
export const refreshToken = async ({user = false, tries = 0} = {}) => {
  const auth = store.getState().auth
  let r = await Axios.post('/api/v1/auth/refresh', {userId: auth.userId}, {validateStatus: () => true})
  if (r.status === 200) {
    store.dispatch({type: 'UPDATE_AUTH', data: r.data})
    store.dispatch({type: 'UPDATE_AUTHORIZED', data: true})
    user && getUser({tries})
  } else
    store.dispatch({type: 'UPDATE_AUTHORIZED', data: false})
}
const getUser = async ({tries = 0} = {}) => {
  if (tries >= 2) {
    store.dispatch({type: 'UPDATE_USER', data: {}})
    store.dispatch({type: 'UPDATE_AUTHORIZED', data: false})
    return
  }
  const auth = store.getState().auth
  let r = await Axios.get('/api/v1/auth/@me', {headers: {authorization: 'Bearer ' + auth.token, user_id: auth.userId}, validateStatus: () => true})
  if (r.status === 200) {
    store.dispatch({type: 'UPDATE_USER', data: r.data})
    store.dispatch({type: 'UPDATE_AUTHORIZED', data: true})
    getGuilds()
  } else
    refreshToken({user: true, tries: tries + 1})
}

export const useAuth = () => {
  const isAuthenticated = useSelector(s => s.authorized)
  const auth = useSelector(s => s.auth)
  const user = useSelector(s => s.user)
  const guilds = useSelector(s => s.guilds)
  return { isAuthenticated, guilds, auth, user, refreshToken, getUser, getGuilds }
}