import { Sound } from './sound'
import { Word, SprintResultType, SprintSettings } from '../interfaces/interfaces'

export class SprintResult {
  correct: Word[]
  wrong: Word[]
  percent: number
  total: number
  points: number
  streaks: number
  message: string

  constructor() {}

  private updateResult(results: SprintResultType, settings: SprintSettings) {
    settings.isRoundOver = true
    this.points = results.points
    this.streaks = results.streaks
    this.correct = results.answers.true
    this.wrong = results.answers.false
    this.total = this.correct.length + this.wrong.length
    this.percent = this.total === 0 ? 0 : Math.round(100 / (this.total / this.correct.length))
  }

  private getMessage() {
    let message: string
    if (this.percent <= 30) {
      message = 'Try another game. You useless!'
    } else if (this.percent <= 50) {
      message = 'You can do better. Maybe.'
    } else if (this.percent <= 75) {
      message = 'Nice! You start learning!'
    } else if (this.percent < 100) {
      message = 'Almost done!'
    } else if (this.percent == 100) {
      message = 'You are native speaker now. Congrats!'
    }
    return message
  }

  public renderResult(results: SprintResultType, settings: SprintSettings) {
    this.updateResult(results, settings)

    const rightResults = this.wrong.map((word) => {
      return this.makeResultItem(word)
    })
    const wrongResults = this.correct.map((word) => {
      return this.makeResultItem(word)
    })
    console.log(this)
    return (document.querySelector('.sprint__container').innerHTML = `
    
    <span>You earned - ${this.points} points</span>
    <span>${this.correct.length}/${this.total} </span>
    <span>Your longest streak - ${this.streaks} correct answers</span>
    <span>${this.percent}% correct answers</span>
    <span>${this.getMessage()}</span>
    <ul class="answer-list">
      <li>
        <h3>Wrong (${this.wrong.length})</h3>
        <ul class="result_wrong">
        ${rightResults.join('')}
        </ul>
      </li>
      <li>
        <h3>Correct (${this.correct.length})</h3>
        <ul class="result_right">
        ${wrongResults.join('')}
        </ul>
      </li>
    </ul>
  
    <button class="new-round">new game</button>
  `)
  }

  private makeResultItem(word: Word) {
    return `
<li>
  ${new Sound(word.audio).render()} 
  <span class="result_word">${word.word}</span>-<span class="result_translation">${word.wordTranslate}</span>
</li>`
  }
}
