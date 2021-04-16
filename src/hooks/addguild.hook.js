import axios from 'axios'
import { useRef } from 'react'
import { useCookies } from 'react-cookie'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import socketIOClient from 'socket.io-client'
import { useAuth } from './auth.hook'

export const useAddGuild = () => {
  const [_, setCookie] = useCookies(['guild'])
  const history = useHistory()
  const ioRef = useRef()
  const { getGuilds } = useAuth()
  return id => {
    ioRef.current && ioRef.current.disconnect()
    const w = window.open(
      `https://discord.com/oauth2/authorize?client_id=${SERVER_CONFIG.clientId}&scope=bot&permissions=8&redirect_uri=${SERVER_CONFIG.url}joinGuild&guild_id=${id}`,
      'Add guild',
      `width=500,height=800,top=${window.top.outerHeight / 2 + window.top.screenY - (800 / 2)},left=${window.top.outerWidth / 2 + window.top.screenX - (500 / 2)}`)
    const io = socketIOClient({path: '/socket/awaitForJoin'})
    ioRef.current = io
    io.emit('init', id)
    io.on('joined', () => {
      setCookie('guild', id)
      history.push('/dashboard')
      w.close()
      io.disconnect()
      getGuilds()
    })
  }
}