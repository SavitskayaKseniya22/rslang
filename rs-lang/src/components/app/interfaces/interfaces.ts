import ApiService from '../api-service/api-service'
import { SprintResult } from '../sprint/sprintResult'

export interface Word {
  _id?: string
  id: string
  group: number
  page: number
  word: string
  image: string
  audio: string
  userWord?: UserWordInfo
  audioMeaning: string
  audioExample: string
  textMeaning: string
  textExample: string
  transcription: string
  wordTranslate: string
  textMeaningTranslate: string
  textExampleTranslate: string
}

export type Question = {
  truthyAnswer: Word
  falsyAnswers: Word[]
}

export interface FormInfo {
  email: string
  password: string
  name?: string
}

export interface UserTemplate {
  message: string
  token: string
  refreshToken: string
  userId: string
  name: string
}

export interface UserWordInfo {
  id?: string
  difficulty: string // either learned or normal or difficult
  optional: {
    timesGuessed: number // 3 times for a normal word to become learned, 5 times for a difficult one
    timesMax: number // 3 for normal ones 5 for difficult ones
    dateEncountered: string
    dateLearned: string | null | undefined
  }
}

export interface SprintResultType {
  answers: { [key: string]: Word[] }
  points: number
  multiplier: number
  streak: number
  bestStreak: number
  counter: number
  newWords: number
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

export interface ButtonProperties {
  text: string
  className: string
}

export interface statObj {
  learnedWords: 0
  optional: {
    sprintStat: statSprint
    audioStat: statAudio
    dateStr: string
  }
}
export interface statAudio {
  countNewWord: number,
  percentTrueAnswer: number,
  inRow: number,
  played: boolean
}
export interface statSprint {
  streak: number,
  percent: number,
  newWords: number,
  played: boolean
}