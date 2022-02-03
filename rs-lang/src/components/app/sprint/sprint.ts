import './sprint.css'
import ApiService from '../api-service/api-service'
import { SprintRound, Word } from './sprintRound'
import { SprintResult } from './sprintResult'
import { getWords } from './utils'

export class Sprint {
  service: ApiService
  lvl: number
  round: SprintRound
  results: Word[][]
  timerValue: number
  words: Word[]

  constructor(lvl: number, service: ApiService) {
    this.lvl = lvl
    this.service = service
    this.timerValue = 15
    this.results = [[], []]
    this.initListener()
  }

  async updateSprint() {
    this.words = await getWords(this.lvl, this.service)
    this.results = [[], []]
    this.round.updateRound(this.results, this.words)
    this.render()
  }

  addTimer() {
    let timerCurrentValue = this.timerValue
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
    }, this.timerValue * 1000 + 1000)
  }

  async render() {
    this.words = this.words ? this.words : await getWords(this.lvl, this.service)
    this.round = this.round ? this.round : new SprintRound(this.results, this.words, this.lvl, this.service)
    document.querySelector('.main').innerHTML = this.makeGame()
    this.addTimer()
  }

  makeGame() {
    return `<div class="sprint">
    <h2>Sprint</h2>
    <div class="sprint__timer">${this.timerValue}</div>
    <button class="sprint__closer"><i class="far fa-times-circle"></i></button>
    <div class="sprint__container">
      <span class="sprint__counter">0</span>
      <ul class="sprint__counter-preview">
        <li><i class="far fa-circle"></i></li>
        <li><i class="far fa-circle"></i></li>
        <li><i class="far fa-circle"></i></li>
      </ul>

      <ul class="sprint__words">
       ${this.round.makeRound()}
      </ul>

      <ul class="sprint__verdict">
        <li class="sprint__verdict_wrong"> <button><i class="fas fa-times-circle"></i></button></li>
        <li class="sprint__verdict_true"><button><i class="fas fa-check-circle"></i></button></li>
      </ul>
      <ul class="sprint__pagination">
        <li class="sprint__pagination_previous"><button><i class="fas fa-arrow-circle-left"></i></button></li>
        <li class="sprint__pagination_next"><button><i class="fas fa-arrow-circle-right"></i> </button></li>
      </ul>
    </div>
  </div>`
  }

  initListener() {
    document.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement
      if (target.closest('.new-round')) {
        await this.updateSprint()
      }
    })
  }
}
