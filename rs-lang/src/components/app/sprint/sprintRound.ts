import ApiService from '../api-service/api-service'
import { getRandomNumber } from './utils'
import { Sound } from './sound'

export class SprintRound {
  sugestedWord: Word
  sugestedAnswer: Word
  service: ApiService
  results: Word[][]
  sound: Sound

  constructor(service: ApiService, results: Word[][]) {
    this.service = service
    this.results = results
    this.initListener()
  }

  updateRound(results: Word[][]) {
    this.results = results
  }

  async getWords() {
    const words = await this.service.getWords(1, 1)
    return words
  }

  async makeRound() {
    const randomNum = Math.random() > 0.7 ? 1 : 0
    const words = await this.getWords()
    const maxValue = words.length - 1
    this.sugestedWord = words[getRandomNumber(maxValue)]
    this.sugestedAnswer = randomNum ? this.sugestedWord : words[getRandomNumber(maxValue)]
    this.sound = new Sound(this.sugestedWord.audio)
    return `<li><span class="sprint__words_suggested">${this.sugestedWord.word}</span> ${this.sound.render()}</li>
    <li><span class="sprint__words_translation">${this.sugestedAnswer.wordTranslate}</span></li>`
  }

  async renderRound() {
    const round = await this.makeRound()
    document.querySelector('.sprint__words').innerHTML = round
  }

  isEven() {
    return this.sugestedWord.word === this.sugestedAnswer.word ? true : false
  }

  saveMiddleResult(isTrue: boolean) {
    if (isTrue) {
      this.results[1].push(this.sugestedWord)
    } else {
      this.results[0].push(this.sugestedWord)
    }
  }

  initListener() {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (target.closest('.sprint__verdict_wrong')) {
        this.saveMiddleResult(!this.isEven())
        this.renderRound()
      } else if (target.closest('.sprint__verdict_true')) {
        this.saveMiddleResult(this.isEven())
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
