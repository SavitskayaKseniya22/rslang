import ApiService from '../api-service/api-service'

export function getRandomNumber(max: number) {
  const rand = -0.5 + Math.random() * (max + 1)
  return Math.round(rand)
}

export function isEven(firstWord: string, secondWord: string) {
  return firstWord === secondWord ? true : false
}

export async function getWords(lvl: number, service: ApiService) {
  const pageNum = getRandomNumber(29)
  const words = await service.getWords(lvl, pageNum)
  return words
}
