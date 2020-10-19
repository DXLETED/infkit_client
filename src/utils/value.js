let options = {
  'prefix': ['`', '/', '!', '~', '@', '>'],
  'levels/voiceXPRate': [0, 0.5, 0.75, 1, 2, 5, 10],
  'levels/textXPRate': [0, 1, 2, 5, 10, 20, 50],
  'levels/msgTimeout': [0, 2000, 5000, 10000, 30000, 60000],
  'music/volume': [0.1, 0.2, 0.5, 0.75, 1],
  'poll/duration': [5000, 20000, 60000, 120000, 600000]
}

export const value = {
  fromOptions: (v, key) => {
    if (v.custom)
      return v.v
    else if (options[key])
      return options[key][v.o]
    else return 0
  }
}