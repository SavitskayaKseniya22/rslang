import { Word } from './sprintRound'
import { Sound } from './sound'

export class SprintResult {
  results: Word[][]
  points: { value: number }

  constructor(results: Word[][], points: { value: number }) {
    this.results = results
    this.points = points
  }

  renderResult() {
    const rightResults = this.results[0].map((word) => {
      return this.makeResultItem(word)
    })

    const wrongResults = this.results[1].map((word) => {
      return this.makeResultItem(word)
    })

    return (document.querySelector('.main').innerHTML = `<div class="result">
    <button class="new-round">new game</button>
    <span>You earned ${this.points.value} points</span>
    <ul class="result_wrong">
    <h3>Wrong (${this.results[0].length})</h3>
      ${rightResults.join('')}
    </ul>
    <ul class="result_right">
    <h3>Correct (${this.results[1].length})</h3>
    ${wrongResults.join('')}</ul>
  </div>`)
  }

  makeResultItem(word: Word) {
    return `<li>${new Sound(word.audio).render()} <span class="result_word">${
      word.word
    }</span> - <span class="result_translation">${word.wordTranslate}</span></li>`
  }
}
