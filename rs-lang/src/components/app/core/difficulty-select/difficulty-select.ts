import ApiService from '../../api-service/api-service'
import { Sprint } from '../../sprint/sprint'
import ConrolGame from '../../audioCallGame/controlgame'

class DifficultySelect {
  gameName: string
  service: ApiService
  constructor(gameName: string, service: ApiService) {
    this.gameName = gameName
    this.service = service
  }
  render() {
    const gameName = this.gameName === 'sprint' ? 'Sprint' : 'Audiocall'
    const gameRules =
      this.gameName === 'sprint'
        ? 'Read the word. Answer if the game suggested the correct translation.'
        : 'Listen to the word. Choose the right translation.'
    const gameAdvices =
      this.gameName === 'sprint'
        ? `<li>Press the Space key to pause</li>
    <li>Control the game using the arrows keys on your keyboard</li>`
        : '<li>Use keys 1 to 5 to control game from the keyboard</li>'
    document.querySelector('.main').innerHTML = `
      <div class="diff-select">
      <h1 class="game-name">${gameName}</h1>
      <p class="game-rules">${gameRules}</p>
      <ul class="advices">
        ${gameAdvices}
      </ul>
      <h3>Select difficulty:</h3>
      <div class="level-select-btns">
          <button class="level-select" data-lvl="0">1</button>
          <button class="level-select" data-lvl="1">2</button>
          <button class="level-select" data-lvl="2">3</button>
          <button class="level-select" data-lvl="3">4</button>
          <button class="level-select" data-lvl="4">5</button>
          <button class="level-select" data-lvl="5">6</button>
      </div>
      </div>
      `
    this.addListeners()
  }
  addListeners() {
    document.querySelectorAll('.level-select').forEach((el) => {
      el.addEventListener('click', (e) => {
        const lvl = Number((e.target as HTMLElement).dataset.lvl)
        let page: Sprint | ConrolGame
        switch (
          this.gameName // Uncomment and change when you start working
        ) {
          case 'sprint':
            page = new Sprint(lvl, this.service)
            page.render()
            window.location.hash = 'sprint'
            break
          case 'audio-challenge':
            new ConrolGame(lvl)
            window.location.hash = 'audio-challenge'
        }
      })
    })
  }
}
export default DifficultySelect
