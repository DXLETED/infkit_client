const msMatch = (str = '') => {
  const match = (str.match(/(\s|^)(\d{1,1}Y)?(\d{1,2}(W|w))?(\d{1,2}(D|d))?(\d{1,2}(H|h))?(\d{1,2}(M|m))?(\d{1,2}(S|s))?(\d{1,3}ms)?(\s|$)/g) || [])[0] || ''
  return match.trim()
}

const ms = str => {
  const match = msMatch(str)
  if (!match) return 0
  let ms = 0
  ms += parseInt(((match.match(/(\s|^)\d{1,2}Y(\d|\s|$)/g) || [])[0] || '0Y').slice(0, -1)) * 31449600000
  ms += parseInt(((match.match(/\d{1,2}(W|w)(\d|\s|$)/g) || [])[0] || '0W').slice(0, -1)) * 604800000
  ms += parseInt(((match.match(/\d{1,2}(D|d)(\d|\s|$)/g) || [])[0] || '0d').slice(0, -1)) * 86400000
  ms += parseInt(((match.match(/\d{1,2}(H|h)(\d|\s|$)/g) || [])[0] || '0h').slice(0, -1)) * 3600000
  ms += parseInt(((match.match(/\d{1,2}(M|m)(\d|\s|$)/g) || [])[0] || '0m').slice(0, -1)) * 60000
  ms += parseInt(((match.match(/\d{1,2}(S|s)(\d|\s|$)/g) || [])[0] || '0s').slice(0, -1)) * 1000
  ms += parseInt(((match.match(/\d{1,3}ms(\s|$)/g) || [])[0] || '0ms').slice(0, -2))
  return ms
}

const msStr = ms => {
  let str = ''
  if (!ms) return '0ms'
  str = ms >= 31449600000 ? str.concat(`${Math.floor(ms % Infinity / 31449600000)}Y `) : str
  str = ms >= 604800000 ? str.concat(`${Math.floor(ms % 31449600000 / 604800000)}W `) : str
  str = ms >= 86400000 ? str.concat(`${Math.floor(ms % 604800000 / 86400000)}d `) : str
  str = ms >= 3600000 ? str.concat(`${Math.floor(ms % 86400000 / 3600000)}h `) : str
  str = ms >= 60000 ? str.concat(`${Math.floor(ms % 3600000 / 60000)}m `) : str
  str = ms >= 1000 ? str.concat(`${Math.floor(ms % 60000 / 1000)}s `) : str
  str = ms >= 1 ? str.concat(`${Math.floor(ms % 1000 / 1)}ms `) : str
  return str.trim()
}

export { msMatch, ms, msStr }