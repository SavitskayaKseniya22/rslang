import { Sound } from './sound'
import { Word, SprintResultType } from './types'

export class SprintResult {
  results: SprintResultType
  longestStreak: number
  correct: Word[]
  wrong: Word[]

  constructor(results: SprintResultType) {
    this.results = results

    this.longestStreak = this.results.streaks
      .join('')
      .split('0')
      .sort((a, b) => {
        return b.length - a.length
      })[0].length

    this.correct = this.results.answers[1]
    this.wrong = this.results.answers[0]
  }

  renderResult() {
    const rightResults = this.wrong.map((word) => {
      return this.makeResultItem(word)
    })

    const wrongResults = this.correct.map((word) => {
      return this.makeResultItem(word)
    })

    return (document.querySelector('.sprint__container').innerHTML = `<div class="result">
    <button class="new-round">new game</button>
    <span>You earned ${this.results.points} points</span>
    <span>Your longest streak - ${this.longestStreak} correct answers</span>
    <ul class="result_wrong">
    <h3>Wrong (${this.wrong.length})</h3>
      ${rightResults.join('')}
    </ul>
    <ul class="result_right">
    <h3>Correct (${this.correct.length})</h3>
    ${wrongResults.join('')}</ul>
  </div>`)
  }

  makeResultItem(word: Word) {
    return `<li>${new Sound(word.audio).render()} <span class="result_word">${
      word.word
    }</span> - <span class="result_translation">${word.wordTranslate}</span></li>`
  }

  get result() {
    return this.result
  }
}
