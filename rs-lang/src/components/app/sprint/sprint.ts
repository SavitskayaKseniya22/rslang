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
  music: HTMLAudioElement
  isBookPage: boolean

  constructor(lvl: number, service: ApiService, pageNumber?: number) {
    this.isBookPage = pageNumber ? true : false

    this.settings = {
      service: service,
      lvl: lvl,
      timerValue: 100,
      pageNumber: pageNumber ?? getRandomNumber(29),
      freeGame: this.isBookPage ? false : true,
      pageStorage: [],
      basicPoints: 10,
      isMusicPlaying: false,
      isRoundOver: false,
    }

    this.settings.pageStorage.push(this.settings.pageNumber)

    this.initListener()
  }

  addTimer() {
    let timerCurrentValue = this.settings.timerValue
    const timerId = setInterval(() => {
      if (document.querySelector('.sprint__timer')) {
        document.querySelector('.sprint__timer').innerHTML = String((timerCurrentValue -= 1))
      } else {
        clearInterval(timerId)
      }
    }, 1000)

    setTimeout(() => {
      clearInterval(timerId)

      new SprintResult(this.results).renderResult()
      this.settings.isRoundOver = true
    }, this.settings.timerValue * 1000 + 1000)
  }

  async render() {
    this.results = { answers: [[], []], points: 0, multiplier: 1, streak: 0, streaks: [] }
    this.words = await this.settings.service.getWords(this.settings.lvl, this.settings.pageNumber)
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
    <button class="sprint__closer"><i class="far fa-times-circle"></i></button>
    <button class="sprint__fullscreen_toggle"><i class="fas fa-expand"></i></button>
    <button class="sprint__background_toggle"><i class="fas fa-music"></i></button>
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
    </div>
  </div>`
  }

  toggleFullScreen(target: HTMLElement) {
    const toFullScreen = target.closest('.sprint__fullscreen_toggle')
    if (toFullScreen.classList.contains('active-fullscreen')) {
      toFullScreen.innerHTML = `<i class="fas fa-expand"></i>`
      toFullScreen.classList.remove('active-fullscreen')
      document.exitFullscreen()
    } else {
      toFullScreen.innerHTML = `<i class="fas fa-compress"></i>`
      toFullScreen.classList.add('active-fullscreen')
      document.documentElement.requestFullscreen()
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

  restoreMusic() {
    if (this.settings.isMusicPlaying) {
      this.music = document.querySelector('.sprint__background')
      this.music.play()
    }
  }

  async startNewSprint() {
    this.settings.isRoundOver = false

    if (!this.isBookPage) {
      this.settings.pageNumber = getRandomNumber(29)
    }
    await this.render()
    this.restoreMusic()
  }

  initListener() {
    document.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement
      if (target.closest('.new-round')) {
        this.startNewSprint()
      } else if (target.closest('.sprint__fullscreen_toggle')) {
        this.toggleFullScreen(target)
      } else if (target.closest('.sprint__background_toggle')) {
        this.toggleMusic()
      }
    })
  }
}
