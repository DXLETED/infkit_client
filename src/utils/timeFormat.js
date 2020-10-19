let minV = ['ms', 's', 'm', 'h']

export const ms = (str, mins=0) => {
  let stamps = str.split(':').reverse()
  let ms = 0
  stamps.map((s, i) => {
    let min = minV[mins + i]
    if (min === 'ms')
      ms += parseInt(s)
    if (min === 's')
      ms += parseInt(s) * 1000
    if (min === 'm')
      ms += parseInt(s) * 60000
    if (min === 'h')
      ms += parseInt(s) * 3600000
  })
  return ms
}