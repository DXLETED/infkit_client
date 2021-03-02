export const levelsMode = {
  linear: [...Array(101)].map((l, i) => i * 200),
  progressive: [...Array(101)].map((l, i) => Math.round(i * 100 + i * i * 0.1 * 50))
}