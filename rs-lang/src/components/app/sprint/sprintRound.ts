import { getRandomNumber, isEven } from './utils'
import { Sound } from './sound'
import { Word, SprintResultType, SprintSettings } from './types'

export class SprintRound {
  sugestedWord: Word
  sugestedAnswer: Word
  sound: Sound
  words: Word[]
  results: SprintResultType
  settings: SprintSettings
  handleRound: (e: Event | KeyboardEvent) => void

  constructor() {
    this.handleRound = this.startNewRound.bind(this)
  }

  public updateRound(words: Word[], results: SprintResultType, settings: SprintSettings) {
    this.words = words
    this.results = results
    this.settings = settings
  }

  public makeRound() {
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

  public async renderRound() {
    if (this.words.length > 1) {
      document.querySelector('.sprint__words').innerHTML = this.makeRound()
    } else {
      if (this.settings.isFreeGame) {
        let randomNum = getRandomNumber(29)
        while (this.settings.pageStorage.includes(randomNum)) {
          randomNum = getRandomNumber(29)
        }
        this.settings.pageNumber = randomNum
      } else {
        this.settings.pageNumber--
      }

      if (this.settings.pageNumber >= 0) {
        this.settings.pageStorage.push(this.settings.pageNumber)
        this.words = this.settings.id
          ? await this.settings.service.getAggregatedWords(
              this.settings.id,
              this.settings.lvl,
              this.settings.pageNumber
            )
          : await this.settings.service.getWords(this.settings.lvl, this.settings.pageNumber)
        document.querySelector('.sprint__words').innerHTML = this.makeRound()
      } else {
        this.settings.resultScreen.renderResult(this.results, this.settings)
        //this.settings.isRoundOver = true
      }
    }
  }

  private saveMiddleResult(isTrue: boolean) {
    if (isTrue) {
      if (this.results.streak < 3) {
        this.results.streak++
        document.querySelector(`.streak${this.results.streak}`).classList.add('counter-full')
      } else {
        this.clearStreak()
        this.results.multiplier++
      }

      this.results.answers[1].push(this.sugestedWord)
      this.results.points += this.getPoints()
      document.querySelector('.sprint__score').innerHTML = String(this.results.points)
      this.fillStreak(1)
    } else {
      this.results.answers[0].push(this.sugestedWord)
      this.clearStreak()
      this.results.multiplier = 1
      this.fillStreak(0)
    }

    this.toggleSoundEffects(isTrue)
    document.querySelector('.sprint__points').innerHTML = String(this.getPoints())
  }

  private toggleSoundEffects(isTrue: boolean) {
    if (this.settings.isMusicPlaying) {
      const soundEffect = isTrue
        ? (document.querySelector('.sprint__answer_correct') as HTMLAudioElement)
        : (document.querySelector('.sprint__answer_wrong') as HTMLAudioElement)

      soundEffect.play()
    }
  }

  private getPoints() {
    return this.settings.basicPoints * this.results.multiplier
  }

  private fillStreak(value: 1 | 0) {
    this.results.streaks.push(value)
  }

  private clearStreak() {
    document.querySelectorAll(`.counter-full`).forEach((element) => {
      element.classList.remove('counter-full')
    })
    this.results.streak = 0
  }

  private startNewRound(e: Event | KeyboardEvent) {
    const target = e.target as HTMLElement
    let isTrue: boolean
    if (
      target.closest('.sprint__verdict_wrong') ||
      target.closest('.sprint__verdict_true') ||
      (e as KeyboardEvent).code == 'ArrowRight' ||
      (e as KeyboardEvent).code == 'ArrowLeft'
    ) {
      if (!this.settings.isRoundOver && !this.settings.isPaused) {
        if (target.closest('.sprint__verdict_wrong') && !isEven(this.sugestedWord.word, this.sugestedAnswer.word)) {
          isTrue = true
        } else if (
          target.closest('.sprint__verdict_true') &&
          isEven(this.sugestedWord.word, this.sugestedAnswer.word)
        ) {
          isTrue = true
        } else if (
          (e as KeyboardEvent).code == 'ArrowLeft' &&
          !isEven(this.sugestedWord.word, this.sugestedAnswer.word)
        ) {
          isTrue = true
        } else if (
          (e as KeyboardEvent).code == 'ArrowRight' &&
          isEven(this.sugestedWord.word, this.sugestedAnswer.word)
        ) {
          isTrue = true
        } else {
          isTrue = false
        }
      }

      e.preventDefault()
      this.saveMiddleResult(isTrue)
      this.renderRound()
    }
  }

  public removeListener() {
    document.removeEventListener('keydown', this.handleRound)
    document.removeEventListener('click', this.handleRound)
  }

  public initListener() {
    document.addEventListener('click', this.handleRound)
    document.addEventListener('keydown', this.handleRound)
  }
}
