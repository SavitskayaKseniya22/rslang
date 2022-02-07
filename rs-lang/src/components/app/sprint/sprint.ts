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
      timerValue: 60,
      pageNumber: pageNumber ?? getRandomNumber(29),
      isFreeGame: pageNumber ? false : true,
      pageStorage: [],
      basicPoints: 10,
      isMusicPlaying: false,
      isRoundOver: false,
      isPaused: false,
      isLoginActive: false,
      isFullScreenOn: false,
    }

    this.settings.pageStorage.push(this.settings.pageNumber)
    //this.id=window.localStorasge.getItem("id")
    this.initListener()
  }

  addTimer() {
    this.timerCurrentValue = this.settings.timerValue

    const timerId = setInterval(() => {
      if (this.timerCurrentValue > 0) {
        if (!this.settings.isPaused) {
          if (document.querySelector('.sprint__timer')) {
            document.querySelector('.sprint__timer').innerHTML = String((this.timerCurrentValue -= 1))
          } else {
            clearInterval(timerId)
          }
        }
      } else {
        clearInterval(timerId)
        new SprintResult(this.results).renderResult()
        this.settings.isRoundOver = true
      }
    }, 1000)
  }

  async render() {
    this.results = { answers: [[], []], points: 0, multiplier: 1, streak: 0, streaks: [] }
    this.words = this.settings.isLoginActive
      ? await this.settings.service.getAggregatedWords(this.id, this.settings.lvl, this.settings.pageNumber)
      : await this.settings.service.getWords(this.settings.lvl, this.settings.pageNumber)
    this.round
      ? this.round.updateRound(this.words, this.results)
      : (this.round = new SprintRound(this.results, this.words, this.settings))

    document.querySelector('.main').innerHTML = this.makeGame()
    this.addTimer()
  }

  makeGame() {
    return `<div class="sprint">
    <audio class="sprint__background" src="./sounds/sprint-background.mp3"></audio>
    <audio class="sprint__answer_correct" src="./sounds/correctAnswer.mp3"></audio>
    <audio class="sprint__answer_wrong" src="./sounds/wrongAnswer.mp3"></audio>
    
    <h2>Sprint</h2>
    <div class="sprint__timer">${this.settings.timerValue}</div>

    <ul class="sprint__settings">
        <li><button class="sprint__fullscreen_toggle"><i class="fas fa-expand"></i></button></li>
        <li><button class="sprint__background_toggle"><i class="fas fa-music"></i></button></li>
      </ul>
    
    <div class="sprint__container">
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
        <li class="sprint__verdict_wrong"><button><i class="fas fa-times-circle"></i></button></li>
        <li class="sprint__verdict_true"><button><i class="fas fa-check-circle"></i></button></li>
      </ul>
      <ul class="sprint__verdict">
        <li class="sprint__verdict_wrong"><button><i class="fas fa-arrow-circle-left"></i></button></li>
        <li class="sprint__verdict_true"><button><i class="fas fa-arrow-circle-right"></i> </button></li>
      </ul>
      <ul class="sprint__advices">
        <li>Press the Space key to pause</li>
        <li>Control the game using the arrows keys on your keyboard</li>
      </ul>
    </div>
    
  </div>`
  }

  toggleFullScreen() {
    const fullScreen = document.querySelector('.sprint__fullscreen_toggle')
    if (this.settings.isFullScreenOn) {
      document.exitFullscreen()
      fullScreen.innerHTML = `<i class="fas fa-expand"></i>`
      this.settings.isFullScreenOn = false
    } else {
      document.documentElement.requestFullscreen()
      fullScreen.innerHTML = `<i class="fas fa-compress"></i>`
      this.settings.isFullScreenOn = true
    }
  }

  toggleMusic() {
    const music = document.querySelector('.sprint__background') as HTMLAudioElement
    if (music.paused) {
      music.play()
      this.settings.isMusicPlaying = true
    } else {
      music.pause()
      this.settings.isMusicPlaying = false
    }
  }

  restoreFullScreen() {
    if (this.settings.isFullScreenOn) {
      const fullScreen = document.querySelector('.sprint__fullscreen_toggle')
      fullScreen.innerHTML = `<i class="fas fa-compress"></i>`
    }
  }

  restoreMusic() {
    if (this.settings.isMusicPlaying) {
      const music = document.querySelector('.sprint__background') as HTMLAudioElement
      music.play()
    }
  }

  async startNewSprint() {
    this.settings.isRoundOver = false
    this.settings.isPaused = false
    if (this.settings.isFreeGame) {
      this.settings.pageNumber = getRandomNumber(29)
    }
    await this.render()
    this.restoreMusic()
    this.restoreFullScreen()
  }

  initListener() {
    document.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement
      if (target.closest('.new-round')) {
        this.startNewSprint()
      } else if (target.closest('.sprint__fullscreen_toggle')) {
        this.toggleFullScreen()
      } else if (target.closest('.sprint__background_toggle')) {
        this.toggleMusic()
      }
    })

    document.addEventListener('keydown', (event) => {
      if (event.code == 'Space' && !this.settings.isRoundOver) {
        event.preventDefault()
        this.settings.isPaused = !this.settings.isPaused
        this.settings.isPaused
          ? (document.querySelector('.sprint__timer').innerHTML = '<i class="fas fa-pause-circle"></i>')
          : (document.querySelector('.sprint__timer').innerHTML = String(this.timerCurrentValue))
      }
    })
  }
}
