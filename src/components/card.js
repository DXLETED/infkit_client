import Color from 'color'
import React, { useEffect, useRef } from 'react'
import { useCallbackRef } from 'use-callback-ref'
import { useAuth } from '../hooks/auth.hook'

const loadImage = src => new Promise(res => {
  const img = new Image()
  img.src = src
  img.addEventListener('load', () => res(img))
  img.addEventListener('error', () => res())
})

export const Card = ({s, scale = 1}) => {
  const { user } = useAuth()
  const draw = async (canvas, { colors = {} }) => {
    colors = Object.fromEntries(Object.entries(colors).map(([cn, c]) => [cn, Color(c).string()]))

    const username = user?.username || 'USERNAME',
          discriminator = user?.discriminator || '0000',
          xp = 20,
          total = 100,
          level = 10,
          avatarUrl = user?.avatar && `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
          image = avatarUrl && await loadImage(avatarUrl)
    const ctx = canvas.getContext('2d')
    const textWidth = {}
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()

    ctx.fillStyle = colors.bg
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = colors.bgname
    ctx.fillRect(20, 20, canvas.width - 40, 80)

    ctx.font = '30px Exo2'
    ctx.fillStyle = colors.text1
    ctx.fillText(username, 120, 70)
    textWidth.name = ctx.measureText(username).width

    ctx.font = '22px Exo2'
    ctx.fillStyle = colors.text2
    ctx.fillText(`#${discriminator}`, 120 + textWidth.name + 15, 70)

    ctx.fillStyle = colors.bgxp
    ctx.fillRect(20, 165, 560, 15)
    
    ctx.fillStyle = colors.xp
    ctx.fillRect(20, 165, xp / total * 560, 15)

    ctx.font = '20px Exo2'
    ctx.fillStyle = colors.text3
    ctx.fillText(`Level ${level}`, 20, 155)

    ctx.font = '20px Exo2'
    ctx.fillStyle = colors.text3
    ctx.textAlign = 'right'
    ctx.fillText('XP', canvas.width - 20, 155)
    textWidth.XP = ctx.measureText('XP').width

    ctx.fillStyle = colors.text4
    ctx.fillText(`/ ${total}`, canvas.width - 20 - textWidth.XP - 5, 155)
    textWidth.total = ctx.measureText(`/ ${total}`).width
    
    ctx.fillStyle = colors.text3
    ctx.fillText(xp, canvas.width - 20 - textWidth.XP - 5 - textWidth.total - 5, 155)
    
    ctx.beginPath()
    ctx.arc(70, 60, 30, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.clip()
    ctx.fillStyle = colors.bg
    ctx.fillRect(40, 30, 60, 60)
    image && ctx.drawImage(image, 40, 30, 60, 60)
    ctx.restore()
  }
  const ref = useCallbackRef(null, reff => reff && draw(reff, s))
  useEffect(() => {
    ref.current && draw(ref.current, s)
  }, [s])
  return <canvas width={600} height={200} style={{zoom: scale}} ref={ref} />
}