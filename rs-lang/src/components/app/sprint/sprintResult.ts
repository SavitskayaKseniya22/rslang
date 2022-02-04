import { Sound } from './sound'
import { Word, SprintResultType } from './types'

export class SprintResult {
  results: SprintResultType

  constructor(results: SprintResultType) {
    this.results = results
  }

  renderResult() {
    const rightResults = this.results.answers[0].map((word) => {
      return this.makeResultItem(word)
    })

    const wrongResults = this.results.answers[1].map((word) => {
      return this.makeResultItem(word)
    })

    return (document.querySelector('.main').innerHTML = `<div class="result">
    <button class="new-round">new game</button>
    <span>You earned ${this.results.points} points</span>
    <ul class="result_wrong">
    <h3>Wrong (${this.results.answers[0].length})</h3>
      ${rightResults.join('')}
    </ul>
    <ul class="result_right">
    <h3>Correct (${this.results.answers[1].length})</h3>
    ${wrongResults.join('')}</ul>
  </div>`)
  }

  makeResultItem(word: Word) {
    return `<li>${new Sound(word.audio).render()} <span class="result_word">${
      word.word
    }</span> - <span class="result_translation">${word.wordTranslate}</span></li>`
  }
}
