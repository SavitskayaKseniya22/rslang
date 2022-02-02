import './sprint.css'
import ApiService from '../api-service/api-service'
import { Round, Word } from './round'

export class Sprint {
  service: ApiService
  lvl: number
  round: Round
  results: Word[][]

  constructor(lvl: number, service: ApiService) {
    this.lvl = lvl
    this.service = service
    this.results = [[], []]
    this.round = new Round(this.service, this.results)
    this.addTimer()
  }

  addTimer() {
    let value = 30
    setInterval(() => {
      document.querySelector('.sprint__timer').innerHTML = String((value -= 1))
    }, 1000)
  }

  async render() {
    const game = await this.makeGame()
    document.querySelector('.main').innerHTML = game
  }

  async makeGame() {
    const round = await this.round.makeRound()
    return `<div class="sprint">
    <h2>Sprint</h2>
    <div class="sprint__timer">30</div>
    <button class="sprint__closer"><i class="far fa-times-circle"></i></button>
    <div class="sprint__container">
      <button class="sprint__toggle-sound"><i class="fas fa-music"></i></button>
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
}
