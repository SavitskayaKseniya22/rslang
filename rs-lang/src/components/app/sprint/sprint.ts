import './sprint.css'
import ApiService from '../api-service/api-service'
import { SprintRound } from './sprintRound'
import { SprintResult } from './sprintResult'
import { getRandomNumber } from './utils'
import { Word, SprintResultType, SprintSettings } from './types'

export class Sprint {
  round: SprintRound
  results: SprintResultType
  words: Word[]
  settings: SprintSettings
  pageNumber: number
  isPaused: boolean
  id: number
  timerCurrentValue: number

  constructor(lvl: number, service: ApiService, pageNumber?: number) {
    this.settings = {
      service: service,
      lvl: lvl,
      timerValue: 3,
      pageNumber: pageNumber ?? getRandomNumber(29),
      isFreeGame: !pageNumber,
      pageStorage: [this.pageNumber],
      basicPoints: 10,
      isMusicPlaying: false,
      isRoundOver: false,
      isPaused: false,
      resultScreen: new SprintResult(),
      id: null,
    }
  }

  addTimer() {
    this.timerCurrentValue = this.settings.timerValue

    const timerId = setInterval(() => {
      const timer = document.querySelector('.sprint__timer')

      if (!this.settings.isPaused && timer) {
        if (this.timerCurrentValue > 0) {
          timer.innerHTML = String((this.timerCurrentValue -= 1))
        } else {
          clearInterval(timerId)
          this.settings.resultScreen.updateResult(this.results)
          this.settings.resultScreen.renderResult()
          document.querySelector('.new-round').addEventListener('click', this.render.bind(this))
          this.settings.isRoundOver = true
        }
      } else if (!timer) {
        clearInterval(timerId)
      } else if (this.settings.isPaused && timer) {
        timer.innerHTML = '<i class="fas fa-pause-circle"></i>'
      }
    }, 1000)
  }

  async render() {
    this.updateSettings()
    this.results = { answers: [[], []], points: 0, multiplier: 1, streak: 0, streaks: [] }
    this.words = this.settings.id
      ? await this.settings.service.getAggregatedWords(this.settings.id, this.settings.lvl, this.settings.pageNumber)
      : await this.settings.service.getWords(this.settings.lvl, this.settings.pageNumber)

    this.round = this.round ?? new SprintRound()
    this.round.updateRound(this.words, this.results, this.settings)

    document.querySelector('.sprint')
      ? (document.querySelector('.sprint__container').innerHTML = this.makeGameContent())
      : (document.querySelector('.main').innerHTML = this.makeGameContainer())

    this.addTimer()
    this.initListener()
  }

  updateSettings() {
    this.settings.isRoundOver = false
    this.settings.isPaused = false
    if (this.settings.isFreeGame) {
      this.settings.pageNumber = getRandomNumber(29)
    }
    this.settings.pageStorage = [this.settings.pageNumber]
  }

  makeGameContainer() {
    const fullScreenIcon = document.fullscreenElement ? '<i class="fas fa-compress"></i>' : '<i class="fas fa-expand">'

    return `
    <div class="sprint">
    <audio class="sprint__background" src="./sounds/sprint-background.mp3"></audio>
    <audio class="sprint__answer_correct" src="./sounds/correctAnswer.mp3"></audio>
    <audio class="sprint__answer_wrong" src="./sounds/wrongAnswer.mp3"></audio>
    <h2>Sprint</h2>
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

  makeGameContent() {
    return `
    <div class="sprint__timer">${this.settings.timerValue}</div>
    <span class="sprint__score">0</span>
    <span class="sprint__points">0</span>
    <ul class="sprint__counter-preview">
      <li><i class="far fa-circle streak1"></i></li>
      <li><i class="far fa-circle streak2"></i></li>
      <li><i class="far fa-circle streak3"></i></li>
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
    <ul class="sprint__advices">
      <li>Press the Space key to pause</li>
      <li>Control the game using the arrows keys on your keyboard</li>
    </ul>`
  }

  toggleFullScreen() {
    const fullScreen = document.querySelector('.sprint__fullscreen_toggle')
    if (document.fullscreenElement) {
      document.exitFullscreen()
      fullScreen.innerHTML = `<i class="fas fa-expand"></i>`
    } else {
      document.documentElement.requestFullscreen()
      fullScreen.innerHTML = `<i class="fas fa-compress"></i>`
    }
  }

  toggleMusic() {
    const music = document.querySelector('.sprint__background') as HTMLAudioElement
    music.paused ? music.play() : music.pause()
    this.settings.isMusicPlaying = !this.settings.isMusicPlaying
  }

  removeListener() {
    document.removeEventListener('keydown', (e) => {
      if (e.code == 'Space' && !this.settings.isRoundOver && document.querySelector('.sprint__timer')) {
        e.preventDefault()
        this.settings.isPaused = !this.settings.isPaused
      }
    })
  }

  initListener() {
    this.removeListener()

    document.querySelector('.sprint__fullscreen_toggle').addEventListener('click', this.toggleFullScreen.bind(this))
    document.querySelector('.sprint__background_toggle').addEventListener('click', this.toggleMusic.bind(this))

    document.addEventListener('keydown', (e) => {
      if (e.code == 'Space' && !this.settings.isRoundOver && document.querySelector('.sprint__timer')) {
        e.preventDefault()
        this.settings.isPaused = !this.settings.isPaused
      }
    })
  }
}
