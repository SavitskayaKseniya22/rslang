import { Sound } from './sound'
import { Word, SprintResultType } from './types'

export class SprintResult {
  results: SprintResultType
  longestStreak: number
  correct: Word[]
  wrong: Word[]
  percent: number
  total: number

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
    this.total = this.correct.length + this.wrong.length
    this.percent =
      this.total === 0 ? 0 : Math.round(100 / ((this.correct.length + this.wrong.length) / this.correct.length))
  }

  renderResult() {
    const rightResults = this.wrong.map((word) => {
      return this.makeResultItem(word)
    })

    const wrongResults = this.correct.map((word) => {
      return this.makeResultItem(word)
    })

    return (document.querySelector('.sprint__container').innerHTML = `
    
    <span>You earned - ${this.results.points} points</span>
    <span>${this.correct.length}/${this.total} </span>
    <span>Your longest streak - ${this.longestStreak} correct answers</span>
    <span>${this.percent}% correct answers</span>
    <h3>Wrong (${this.wrong.length})</h3>
    <ul class="result_wrong">
      ${rightResults.join('')}
    </ul>
    <h3>Correct (${this.correct.length})</h3>
    <ul class="result_right">
    
    ${wrongResults.join('')}</ul>
    <button class="new-round">new game</button>
  `)
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
