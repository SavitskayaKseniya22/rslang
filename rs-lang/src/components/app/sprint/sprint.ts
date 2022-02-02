import './sprint.css'
import ApiService from '../api-service/api-service'
import { Round } from './round'

export class Sprint {
  service: ApiService
  lvl: number
  round: Round

  constructor(lvl: number, service: ApiService) {
    this.lvl = lvl
    this.service = service
    this.round = new Round(this.service)
  }

  addTimer() {}

  async render() {
    const game = await this.makeGame()
    document.querySelector('.main').innerHTML = game
  }

  async makeGame() {
    const round = await this.round.makeRound()
    return `<div class="sprint">
    <h2>Sprint</h2>
    <div class="sprint__timer"></div>
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
