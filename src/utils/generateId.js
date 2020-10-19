export const generateId = arr => {
  var rnd = ''
  while (rnd.length < 8)
    rnd += Math.random().toString(36).substring(2)
  if (arr && arr.includes(rnd))
    return generateId(arr)
  return rnd
}