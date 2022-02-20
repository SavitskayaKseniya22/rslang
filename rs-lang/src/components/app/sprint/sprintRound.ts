import { getRandomNumber, isEven } from './utils'
import { Sound } from './sound'
import { SprintResultType, SprintSettings } from '../interfaces/interfaces'
import { Word } from '../interfaces/interfaces'

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

  private async checkWord(word: Word, isTrue: boolean) {
    const dateObj = new Date()
    const dateStr = `${dateObj.getDate()}/${dateObj.getMonth()}/${dateObj.getFullYear()}`
    if (this.settings.id) {
      if (!word.userWord) {
        this.results.newWords++
        await this.settings.service.requestAddUserWord(this.settings.id, word._id, {
          difficulty: 'normal',
          optional: { timesGuessed: +isTrue, timesMax: 3, dateEncountered: dateStr, dateLearned: '0' },
        })
      } else {
        if ((isTrue && word.userWord.difficulty === 'normal') || (isTrue && word.userWord.difficulty === 'difficult')) {
          word.userWord.optional.timesGuessed++
          if (word.userWord.optional.timesGuessed >= word.userWord.optional.timesMax) {
            word.userWord.difficulty = 'learned'
            word.userWord.optional.dateLearned = dateStr
          }
        }

        if (word.userWord.optional.dateEncountered === '0') {
          word.userWord.optional.dateEncountered = dateStr
          this.results.newWords++
        }

        if (!isTrue) {
          word.userWord.optional.timesGuessed = 0
        }

        if (!isTrue && word.userWord.difficulty === 'learned') {
          word.userWord.difficulty = 'normal'
          word.userWord.optional.dateLearned = '0'
        }

        await this.settings.service.requestUpdateUserWord(this.settings.id, word._id, word.userWord)
      }
    }
  }

  public makeRound() {
    const randomNum = Math.random() > 0.7 ? 1 : 0
    const maxValue = this.words.length - 1
    const randomIndex = getRandomNumber(maxValue)
    this.sugestedWord = this.words[randomIndex]
    this.sugestedAnswer = randomNum ? this.sugestedWord : this.words[getRandomNumber(maxValue)]

    this.words.splice(randomIndex, 1)
    this.sound = new Sound(this.sugestedWord.audio, this.settings)
    return `<li>${this.sound.render()} <span class="sprint__words_suggested">${this.sugestedWord.word}</span></li>
    <li><span class="sprint__words_translation">${this.sugestedAnswer.wordTranslate}</span></li>`
  }

  public async renderRound() {
    if (this.words.length > 0) {
      document.querySelector('.sprint__words').innerHTML = this.makeRound()
    } else {
      if (this.settings.isFreeGame) {
        let randomNum = getRandomNumber(29)
        while (this.settings.pageStorage.includes(randomNum)) {
          randomNum = getRandomNumber(29)
        }
        this.settings.pageNumber = randomNum
        this.settings.pageStorage.push(this.settings.pageNumber)
        if (this.settings.id) {
          this.words = await this.settings.service.requestGetUserAgregatedPageGrp(
            this.settings.id,
            `${this.settings.lvl}`,
            `${this.settings.pageNumber}`,
            `20`
          )
        } else {
          this.words = await this.settings.service.getWords(this.settings.lvl, this.settings.pageNumber)
        }
        document.querySelector('.sprint__words').innerHTML = this.makeRound()
      } else {
        this.settings.resultScreen.renderResult(this.results, this.settings)
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
      this.results.points += this.getPoints()
      this.results.counter++
    } else {
      this.dropCounters()
    }

    if (this.results.counter > this.results.bestStreak) {
      this.results.bestStreak = this.results.counter
    }

    this.results.answers[String(isTrue)].push(this.sugestedWord)
    this.toggleSoundEffects(isTrue)
    this.updatePointsPreview()
    this.checkWord(this.sugestedWord, isTrue)
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

  private updatePointsPreview() {
    document.querySelector('.sprint__points').innerHTML = `+${this.getPoints()}`
    document.querySelector('.sprint__score').innerHTML = String(this.results.points)
  }

  private dropCounters() {
    this.clearStreak()
    this.results.multiplier = 1

    this.results.counter = 0
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
        e.preventDefault()
        this.saveMiddleResult(isTrue)
        this.renderRound()
      }
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
