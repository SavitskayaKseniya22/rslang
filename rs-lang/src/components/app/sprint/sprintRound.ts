import { getRandomNumber, isEven } from './utils'
import { Sound } from './sound'
import { SprintResult } from './sprintResult'
import { Word, SprintResultType, SprintSettings } from './types'

export class SprintRound {
  sugestedWord: Word
  sugestedAnswer: Word
  sound: Sound
  words: Word[]
  results: SprintResultType
  settings: SprintSettings

  constructor(results: SprintResultType, words: Word[], settings: SprintSettings) {
    this.results = results
    this.words = words
    this.settings = settings
    this.initListener()
  }

  updateRound(words: Word[], results: SprintResultType) {
    this.words = words
    this.results = results
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
      if (this.settings.freeGame) {
        let randomNum = getRandomNumber(29)
        console.log(this.settings.pageStorage)
        while (this.settings.pageStorage.includes(randomNum)) {
          randomNum = getRandomNumber(29)
        }
        this.settings.pageNumber = randomNum
      } else {
        this.settings.pageNumber--
      }

      if (this.settings.pageNumber >= 0) {
        this.settings.pageStorage.push(this.settings.pageNumber)
        this.words = await this.settings.service.getWords(this.settings.lvl, this.settings.pageNumber)
        document.querySelector('.sprint__words').innerHTML = this.makeRound()
      } else {
        new SprintResult(this.results).renderResult()
      }
    }
  }

  saveMiddleResult(isTrue: boolean) {
    if (isTrue) {
      this.results.answers[1].push(this.sugestedWord)
      this.results.points += 20 * this.results.multiplier
      document.querySelector('.sprint__counter').innerHTML = String(this.results.points)
    } else {
      this.results.answers[0].push(this.sugestedWord)
    }
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
