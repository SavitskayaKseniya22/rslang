import { Sound } from './sound'
import { Word, SprintResultType, SprintSettings } from '../interfaces/interfaces'

export class SprintResult {
  correct: Word[]
  wrong: Word[]
  percent: number
  total: number
  points: number
  streak: number
  message: string
  settings: SprintSettings
  stats: { streak: number; percent: number; newWords: number; played: boolean }
  newWords: number

  constructor() {}

  private updateResult(results: SprintResultType, settings: SprintSettings) {
    this.settings = settings
    settings.isRoundOver = true
    this.newWords = results.newWords
    this.points = results.points
    this.streak = results.bestStreak
    this.correct = results.answers.true
    this.wrong = results.answers.false
    this.total = this.correct.length + this.wrong.length
    this.percent = this.total === 0 ? 0 : Math.round(100 / (this.total / this.correct.length))
  }

  private getMessage() {
    let message: string
    if (this.percent <= 30) {
      message = 'Next time will be better!'
    } else if (this.percent <= 50) {
      message = 'You can do better!'
    } else if (this.percent <= 75) {
      message = 'Nice! You start learning!'
    } else if (this.percent < 100) {
      message = 'Almost done!'
    } else if (this.percent == 100) {
      message = 'You are native speaker now. Congrats!'
    }
    return message
  }

  async updateStats() {
    if (this.settings.id) {
      this.stats = { streak: this.streak, percent: this.percent, newWords: this.newWords, played: true }
      let audioStat = { countNewWord: 0, percentTrueAnswer: 0, inRow: 0, played: false }
      try {
        const tempStats = await this.settings.service.getUserStatistics(this.settings.id)

        this.stats.streak =
          tempStats.optional.sprintStat.streak < this.streak ? this.streak : tempStats.optional.sprintStat.streak

        this.stats.percent = tempStats.optional.sprintStat.played
          ? Math.round((tempStats.optional.sprintStat.percent + this.percent) / 2)
          : this.percent

        this.stats.newWords = tempStats.optional.sprintStat.newWords + this.newWords
        audioStat = tempStats.optional.audioStat
      } catch (error) {
        if ((error as Error).message.includes('401') || (error as Error).message.includes('403')) {
          await this.settings.service.updateToken()
        }
      }

      try {
        await this.settings.service.requestUpdStatistics(this.settings.id, {
          learnedWords: 0,
          optional: {
            sprintStat: this.stats,
            audioStat: audioStat,
            dateStr: `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`,
          },
        })
      } catch (error) {
        if ((error as Error).message.includes('401') || (error as Error).message.includes('403')) {
          await this.settings.service.updateToken()
        }
      }
    }
  }

  public renderResult(results: SprintResultType, settings: SprintSettings) {
    this.updateResult(results, settings)

    const rightResults = this.wrong.map((word) => {
      return this.makeResultItem(word)
    })

    const wrongResults = this.correct.map((word) => {
      return this.makeResultItem(word)
    })

    this.updateStats()

    const button = settings.isFreeGame
      ? `<button class="new-round">new game</button>`
      : `<button class="back-study">back to study</button>`
    const newWords = settings.id && this.newWords ? `<span>${this.newWords} new words</span>` : ''
    return (document.querySelector('.sprint__container').innerHTML = `
    
    <span class="sprint__points">You earned - ${this.points} points</span>
    <span>${this.correct.length}/${this.total} </span>
    <span>Your longest streak - ${this.streak} correct answers</span>
    <span>${this.percent}% correct answers</span>
    ${newWords}
    <span class="sprint__message">${this.getMessage()}</span>
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
  
    ${button}
  `)
  }

  private makeResultItem(word: Word) {
    return `
<li>
  ${new Sound(word.audio, this.settings).render()} 
  <p><span class="result_word">${word.word}</span> - <span class="result_translation">${word.wordTranslate}</span></p>
</li>`
  }
}
