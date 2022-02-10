import ApiService from '../api-service/api-service'
import { SprintResult } from './sprintResult'

export interface Word {
  id: string
  group: number
  page: number
  word: string
  image: string
  audio: string
  audioMeaning: string
  audioExample: string
  textMeaning: string
  textExample: string
  transcription: string
  wordTranslate: string
  textMeaningTranslate: string
  textExampleTranslate: string
}

export interface SprintResultType {
  answers: Word[][]
  points: number
  multiplier: number
  streak: number

  streaks: number[]
}

export interface SprintSettings {
  service: ApiService
  lvl: number
  timerValue: number
  pageNumber: number
  isFreeGame: boolean
  pageStorage: number[]
  basicPoints: number
  isMusicPlaying: boolean
  isRoundOver: boolean
  isPaused: boolean

  resultScreen: SprintResult
  id: null | string
}
