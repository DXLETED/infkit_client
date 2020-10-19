export const levelsMode = [
  [...Array(101)].map((l, i) => i * 2 * 200),
  [...Array(101)].map((l, i) => Math.round(i * 2 * 100 + i * i * 0.1 * 50))
]