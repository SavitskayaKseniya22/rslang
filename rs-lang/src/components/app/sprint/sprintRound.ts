import { getRandomNumber, isEven } from './utils'
import { Sound } from './sound'
import { getWords } from './utils'
import ApiService from '../api-service/api-service'

export class SprintRound {
  sugestedWord: Word
  sugestedAnswer: Word
  results: Word[][]
  sound: Sound
  words: Word[]
  lvl: number
  service: ApiService

  constructor(results: Word[][], words: Word[], lvl: number, service: ApiService) {
    this.results = results
    this.words = words
    this.lvl = lvl
    this.service = service
    this.initListener()
  }

  updateRound(results: Word[][], words: Word[]) {
    this.results = results
    this.words = words
  }

  makeRound() {
    const randomNum = Math.random() > 0.7 ? 1 : 0
    const maxValue = this.words.length - 1
    const randomIndex = getRandomNumber(maxValue)
    this.sugestedWord = this.words[randomIndex]
    this.sugestedAnswer = randomNum ? this.sugestedWord : this.words[getRandomNumber(maxValue)]
    this.words.splice(randomIndex, 1)
    this.sound = new Sound(this.sugestedWord.audio)
    return `<li><span class="sprint__words_suggested">${this.sugestedWord.word}</span> ${this.sound.render()}</li>
    <li><span class="sprint__words_translation">${this.sugestedAnswer.wordTranslate}</span></li>`
  }

  async renderRound() {
    if (this.words.length > 1) {
      document.querySelector('.sprint__words').innerHTML = this.makeRound()
    } else {
      this.words = await getWords(this.lvl, this.service)
      document.querySelector('.sprint__words').innerHTML = this.makeRound()
    }
  }

  saveMiddleResult(isTrue: boolean) {
    isTrue ? this.results[1].push(this.sugestedWord) : this.results[0].push(this.sugestedWord)
  }

  initListener() {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (target.closest('.sprint__verdict_wrong')) {
        this.saveMiddleResult(!isEven(this.sugestedWord.word, this.sugestedAnswer.word))
        this.renderRound()
      } else if (target.closest('.sprint__verdict_true')) {
        this.saveMiddleResult(isEven(this.sugestedWord.word, this.sugestedAnswer.word))
        this.renderRound()
      }
    })
  }
}

export interface Word {
  id: string
  group: 0
  page: 0
  word: 'string'
  image: 'string'
  audio: 'string'
  audioMeaning: 'string'
  audioExample: 'string'
  textMeaning: 'string'
  textExample: 'string'
  transcription: 'string'
  wordTranslate: 'string'
  textMeaningTranslate: 'string'
  textExampleTranslate: 'string'
}
