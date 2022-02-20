import ApiService from '../api-service/api-service'
import { statObj, UserTemplate } from '../interfaces/interfaces'
import './statistics.css'

class Statistics {
  user: UserTemplate
  apiServiceUser: ApiService
  constructor() {
    this.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
    this.apiServiceUser = new ApiService(this.user)
    if (this.user !== null) {
      this.getStatGames()
    } else this.renderWithoutUser()
  }
  async getStatGames() {
    const userStatistics = await this.apiServiceUser.getUserStatistics(this.apiServiceUser.user.userId)
    const learnedWords = await this.apiServiceUser.requestGetAggregatedFIlter(
      this.apiServiceUser.user.userId,
      `{"$and":[{"userWord.difficulty":"learned"}, {"userWord.optional.dateEncountered":"${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}"}]}`
    )
    this.renderUser(userStatistics, learnedWords.length)
  }
  renderWithoutUser() {
    document.querySelector('.main').innerHTML = ''
    document.querySelector('.main').insertAdjacentHTML(
      'afterbegin',
      `
    <div class="stat-wrapper">
      <h1 class="stat-wrapper__title">Statistics</h1>
      <p class="stat-wrapper__today-title">Log in to get statistics</p>
      
    </div>`
    )
  }
  renderUser(userStatistics: statObj, learnedWords: number) {
    document.querySelector('.main').innerHTML = ''
    document
      .querySelector('.main')
      .insertAdjacentHTML(
        'afterbegin',
        this.getLayoutStatistics([
          userStatistics.optional.audioStat.countNewWord.toString(),
          userStatistics.optional.audioStat.percentTrueAnswer.toString(),
          userStatistics.optional.audioStat.inRow.toString(),
          userStatistics.optional.sprintStat.newWords.toString(),
          userStatistics.optional.sprintStat.percent.toString(),
          userStatistics.optional.sprintStat.streak.toString(),
          learnedWords.toString(),
          userStatistics.optional.sprintStat.played.toString(),
          userStatistics.optional.audioStat.played.toString(),
        ])
      )
  }
  getLayoutStatistics(arr: string[]) {
    const [countNewWord, percentTrueAnswer, inRow, newWords, percent, streak, learnedWords, playedAudio, playedSprint] =
      arr
    let count = 1
    const newWordAudio = arr.length !== 0 ? Number(countNewWord) : 0
    const percentAudio = arr.length !== 0 ? Number(percentTrueAnswer) : 0
    const inRowAudio = arr.length !== 0 ? inRow : 0
    const newWordSprint = arr.length !== 0 ? Number(newWords) : 0
    const percentSprint = arr.length !== 0 ? Number(percent) : 0
    const inRowSprint = arr.length !== 0 ? streak : 0
    const learnWords = arr.length !== 0 ? learnedWords : 0

    if (playedAudio !== 'false' && playedSprint !== 'false') {
      count = 2
    } else count = 1
    const percentGames = Math.floor(percentAudio / count + percentSprint / count)

    return `<div class="stat-wrapper">
      <h1 class="stat-wrapper__title">Statistics</h1>
      <div class="stat-wrapper__today">
        <h2 class="stat-wrapper__today-title">Today</h2>
        <div class="stat-wrapper__today-minigames">
          <div class="stat-wrapper__today-game">
            <h3 class="stat-wrapper__today-name">Audio</h3>
            <div class="stat-list">
            <p><span>new words: </span><span>${newWordAudio}</span></p>
            <p><span>accuracy: </span><span>${percentAudio}%</span></p>
            <p><span>in a row: </span><span>${inRowAudio}</span></p>
            </div>
            
          </div>
          <div class="stat-wrapper__today-game">
            <h3 class="stat-wrapper__today-name">Sprint</h3>
            <div class="stat-list">
            <p><span>new words: </span><span>${newWordSprint}</span></p>
            <p><span>accuracy: </span><span>${percentSprint}%</span></p>
            <p><span>in a row: </span><span>${inRowSprint}</span></p>
            </div>
            
          </div>
           <div class="stat-wrapper__today-game total-stat">
            <h3 class="stat-wrapper__today-name">Total</h3>
            <div class="stat-list">
            <p><span>new words: </span><span>${Number(newWordAudio) + Number(newWordSprint)} </span></p>
            <p><span>learned words: </span><span>${learnWords} </span></p>
            <p><span>accuracy: </span><span>${percentGames}% </span></p>
            </div>
            
          </div>
        </div>    
      </div>
    </div>`
  }
}
export default Statistics
