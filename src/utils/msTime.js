const periodMsToTime = ``

export const msToTime = ms => `${ms >= 3600000 && `${ms % 3600000}`}`
  ms < 1000 ? [ms, 'ms'] :
  ms < 60000 ? [ms / 1000, 's'] :
  ms < 3600000 ? [ms / 60000, 'm'] :
  [ms / 3600000, 'h']

export const timeToMs = (time, type) =>
  type === 0 ? time :
  type === 1 ? time / 1000 :
  type === 2 ? time / 60000 :
  time / 3600000