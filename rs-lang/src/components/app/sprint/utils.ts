export function getRandomNumber(max: number) {
  const rand = -0.5 + Math.random() * (max + 1)
  return Math.round(rand)
}
