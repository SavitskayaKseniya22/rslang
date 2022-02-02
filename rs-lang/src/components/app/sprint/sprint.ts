import './sprint.css'
import ApiService from '../api-service/api-service'
import { SprintRound, Word } from './sprintRound'
import { SprintResult } from './sprintResult'

export class Sprint {
  service: ApiService
  lvl: number
  round: SprintRound
  results: Word[][]
  timerValue: number

  constructor(lvl: number, service: ApiService) {
    this.lvl = lvl
    this.service = service
    this.results = [[], []]
    this.timerValue = 5
    this.round = new SprintRound(this.service, this.results)
    this.initListener()
  }

  addTimer() {
    const timerId = setInterval(() => {
      document.querySelector('.sprint__timer').innerHTML = String((this.timerValue -= 1))
    }, 1000)

    setTimeout(() => {
      clearInterval(timerId)
      new SprintResult(this.results).renderResult()
    }, this.timerValue * 1000 + 1000)
  }

  async render() {
    const game = await this.makeGame()
    document.querySelector('.main').innerHTML = game
    this.addTimer()
  }

  async makeGame() {
    const round = await this.round.makeRound()
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
        ${round}
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
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (target.closest('.new-round')) {
        this.results = [[], []]
        this.timerValue = 5
        this.round.updateRound(this.results)
        this.render()
      }
    })
  }
}
