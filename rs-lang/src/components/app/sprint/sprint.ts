import './sprint.css'
import ApiService from '../api-service/api-service'
import { SprintRound } from './sprintRound'
import { SprintResult } from './sprintResult'
import { getRandomNumber } from './utils'
import { Word, SprintResultType, SprintSettings } from '../interfaces/interfaces'

export class Sprint {
  round: SprintRound
  results: SprintResultType
  words: Word[] | null
  settings: SprintSettings
  pageNumber: number
  isPaused: boolean
  id: number
  timerCurrentValue: number
  handleClick: (e: MouseEvent) => void
  handlePress: (e: KeyboardEvent) => void

  constructor(lvl: number, service: ApiService, wordCollection?: Word[]) {
    this.settings = {
      service: service,
      lvl: lvl,
      timerValue: 60,
      pageNumber: getRandomNumber(29),
      isFreeGame: !wordCollection,
      pageStorage: [this.pageNumber],
      basicPoints: 10,
      isMusicPlaying: false,
      isRoundOver: false,
      isPaused: false,
      resultScreen: new SprintResult(),
      id: service.user?.userId,
    }
    this.words = wordCollection ?? null
    this.handleClick = this.clickListener.bind(this)
    this.handlePress = this.buttonListener.bind(this)

    this.round = new SprintRound()
    this.initListener()
    this.round.initListener()
  }

  private addTimer() {
    this.timerCurrentValue = this.settings.timerValue

    const timerId = setInterval(() => {
      const timer = document.querySelector('.sprint__timer')

      if (!this.settings.isPaused && timer) {
        if (this.timerCurrentValue > 0) {
          timer.innerHTML = String((this.timerCurrentValue -= 1))
        } else {
          clearInterval(timerId)
          this.settings.resultScreen.renderResult(this.results, this.settings)
        }
      } else if (!timer) {
        clearInterval(timerId)
      } else if (this.settings.isPaused && timer) {
        timer.innerHTML = '<i class="fas fa-pause-circle"></i>'
      }
    }, 1000)
  }

  public async render() {
    this.updateSettings()
    this.results = {
      answers: { false: [], true: [] },
      points: 0,
      multiplier: 1,
      streak: 0,
      bestStreak: 0,
      counter: 0,
      newWords: 0,
    }
    if (this.settings.isFreeGame) {
      this.words = this.settings.id
        ? await this.getUserWords()
        : await this.settings.service.getWords(this.settings.lvl, this.settings.pageNumber)
    }

    this.round.updateRound(this.words, this.results, this.settings)

    document.querySelector('.sprint')
      ? (document.querySelector('.sprint__container').innerHTML = this.makeGameContent())
      : (document.querySelector('.main').innerHTML = this.makeGameContainer())

    this.addTimer()
  }

  private async getUserWords() {
    try {
      return await this.settings.service.requestGetUserAgregatedPageGrp(
        this.settings.id,
        `${this.settings.lvl}`,
        `${this.settings.pageNumber}`,
        `20`
      )
    } catch (error) {
      if ((error as Error).message.includes('401') || (error as Error).message.includes('403')) {
        await this.settings.service.updateToken()
      }
    }
  }

  private updateSettings() {
    this.settings.isRoundOver = false
    this.settings.isPaused = false
    if (this.settings.isFreeGame) {
      this.settings.pageNumber = getRandomNumber(29)
    }
    this.settings.pageStorage = [this.settings.pageNumber]
  }

  private makeGameContainer() {
    const fullScreenIcon = document.fullscreenElement ? '<i class="fas fa-compress"></i>' : '<i class="fas fa-expand">'
    return `
    <div class="sprint">
    <audio class="sprint__background" src="./sounds/sprint-background.mp3" loop></audio>
    <audio class="sprint__answer_correct" src="./sounds/correctAnswer.mp3"></audio>
    <audio class="sprint__answer_wrong" src="./sounds/wrongAnswer.mp3"></audio>
    <ul class="sprint__settings">
      <li>
        <button class="sprint__fullscreen_toggle">${fullScreenIcon}</i></button>
      </li>
      <li>
        <button class="sprint__background_toggle"><i class="fas fa-music"></i></button>
      </li>
    </ul>
    <div class="sprint__container">${this.makeGameContent()}</div>
  </div>`
  }

  private makeGameContent() {
    return `
    <div class="sprint__timer">${this.settings.timerValue}</div>
    <span class="sprint__score">0</span>
    <span class="sprint__points">+0</span>
    <ul class="sprint__counter-preview">
      <li class="streak1"></li>
      <li class="streak2"></li>
      <li class="streak3"></li>
    </ul>
    <ul class="sprint__words">
      ${this.round.makeRound()}
    </ul>
    <ul class="sprint__verdict">
      <li class="sprint__verdict_wrong">
        <button><i class="fas fa-times-circle"></i></button>
      </li>
      <li class="sprint__verdict_true">
        <button><i class="fas fa-check-circle"></i></button>
      </li>
    </ul>
    <ul class="sprint__verdict">
      <li class="sprint__verdict_wrong">
        <button><i class="fas fa-arrow-circle-left"></i></button>
      </li>
      <li class="sprint__verdict_true">
        <button><i class="fas fa-arrow-circle-right"></i></button>
      </li>
    </ul>
    `
  }

  private toggleFullScreen() {
    const fullScreen = document.querySelector('.sprint__fullscreen_toggle')
    if (document.fullscreenElement) {
      document.exitFullscreen()
      fullScreen.innerHTML = `<i class="fas fa-expand"></i>`
    } else {
      document.documentElement.requestFullscreen()
      fullScreen.innerHTML = `<i class="fas fa-compress"></i>`
    }
  }

  private toggleMusic() {
    const music = document.querySelector('.sprint__background') as HTMLAudioElement
    music.paused ? music.play() : music.pause()
    this.settings.isMusicPlaying = !this.settings.isMusicPlaying
  }

  private blockButtons(isPaused: boolean) {
    const buttons = document.querySelectorAll('.sprint__verdict button')
    if (isPaused) {
      buttons.forEach((element) => {
        element.classList.add('block-button')
      })
    } else {
      buttons.forEach((element) => {
        element.classList.remove('block-button')
      })
    }
  }

  private buttonListener(e: KeyboardEvent) {
    if ((e as KeyboardEvent).code == 'Space' && !this.settings.isRoundOver) {
      e.preventDefault()
      this.settings.isPaused = !this.settings.isPaused
      this.blockButtons(this.settings.isPaused)
    }
  }

  private clickListener(e: MouseEvent) {
    const target = e.target as HTMLElement
    if (target.closest('.sprint__fullscreen_toggle')) {
      this.toggleFullScreen()
    } else if (target.closest('.sprint__background_toggle')) {
      this.toggleMusic()
    } else if (target.closest('.new-round')) {
      this.render()
    } else if (target.closest('.back-study')) {
      window.location.hash = '#text-book'
    }
  }

  private initListener() {
    document.addEventListener('click', this.handleClick)
    document.addEventListener('keydown', this.handlePress)

    window.addEventListener('hashchange', () => {
      if (window.location.hash !== '#sprint') {
        document.removeEventListener('keydown', this.handlePress)
        document.removeEventListener('click', this.handleClick)
        this.round.removeListener()
      }
    })
  }
}
