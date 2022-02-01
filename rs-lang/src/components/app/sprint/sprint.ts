import ApiService from '../api-service/api-service'
import './sprint.css'

export class Sprint {
  service: ApiService
  lvl: number

  constructor(lvl: number, service: ApiService) {
    this.lvl = lvl
    this.service = service

    //this.service.getWords(1, 1).then((result) => console.log(result))
  }

  addTimer() {}

  render() {
    document.querySelector('.main').innerHTML = this.printGame()
  }

  printGame() {
    return `<div class="sprint">
    <h2>Sprint</h2>
    <div class="sprint__timer"></div>
    <button class="sprint__closer"><i class="far fa-times-circle"></i></button>
    <div class="sprint__container">
      <button class="sprint__toggle-sound"><i class="fas fa-music"></i></button>
      <span class="sprint__counter"></span>
      <ul class="sprint__counter-preview">
        <li><i class="far fa-circle"></i></li>
        <li><i class="far fa-circle"></i></li>
        <li><i class="far fa-circle"></i></li>
      </ul>

      <ul class="sprint__words">
        <li><span class="sprint__words_suggested">word</span></li>
        <li><span class="sprint__words_answered">word</span></li>
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
