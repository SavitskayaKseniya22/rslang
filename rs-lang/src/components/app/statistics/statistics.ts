import ApiService from "../api-service/api-service";
import { statObj, UserTemplate } from "../interfaces/interfaces";
import './statistics.css'

class Statistics {
  user: UserTemplate
  apiServiceUser: ApiService
  constructor() {
    this.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
    this.apiServiceUser = new ApiService(this.user);
    if (this.user !== null) {
      this.getStatGames();
    } else this.renderWithoutUser();
  }
  async getStatGames() {
    const userStatistics = await this.apiServiceUser.getUserStatistics(this.apiServiceUser.user.userId);
    const learnedWords = await this.apiServiceUser.requestGetAggregatedFIlter(this.apiServiceUser.user.userId,
      `{"$and":[{"userWord.difficulty":"learned"}, {"userWord.optional.dateEncountered":"${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}"}]}`);
    this.renderUser(userStatistics, learnedWords.length);
  }
  renderWithoutUser() {
    document.querySelector('.main').innerHTML = '';
    document.querySelector('.main').insertAdjacentHTML('afterbegin', this.getLayoutStatistics([]));
  }
  renderUser(userStatistics: statObj, learnedWords: number) {
    document.querySelector('.main').innerHTML = '';
    document.querySelector('.main').insertAdjacentHTML('afterbegin', this.getLayoutStatistics([
      userStatistics.optional.audioStat.countNewWord.toString(),
      userStatistics.optional.audioStat.percentTrueAnswer.toString(),
      userStatistics.optional.audioStat.inRow.toString(),
      userStatistics.optional.sprintStat.newWords.toString(),
      userStatistics.optional.sprintStat.percent.toString(),
      userStatistics.optional.sprintStat.streak.toString(),
      learnedWords.toString()
    ]));
  }
  getLayoutStatistics(arr: string[]) {
    const [countNewWord, percentTrueAnswer, inRow, newWords, percent, streak, learnedWords] = arr
    let count = 1;
    const newWordAudio = arr.length !== 0 ? Number(countNewWord) : 0;
    const percentAudio = arr.length !== 0 ? Number(percentTrueAnswer) : 0;
    const inRowAudio = arr.length !== 0 ? inRow : 0;
    const newWordSprint = arr.length !== 0 ? Number(newWords) : 0;
    const percentSprint = arr.length !== 0 ? Number(percent) : 0;
    const inRowSprint = arr.length !== 0 ? streak : 0;
    const learnWords = arr.length !== 0 ? learnedWords : 0;

    if (newWordAudio !== 0 && newWordSprint !== 0) {
      count = 2;
    } else count = 1
    const percentGames = Math.floor((percentAudio / count + percentSprint / count))

    return `<div class="stat-wrapper">
      <h1 class="stat-wrapper__title">Statistics</h1>
      <div class="stat-wrapper__today">
        <h2 class="stat-wrapper__today-title">Today</h2>
        <div class="stat-wrapper__today-minigames">
          <div class="stat-wrapper__today-game">
            <h3 class="stat-wrapper__today-name">Audio</h3>
            <h4><span>${newWordAudio}</span> new words</h4>
            <h4><span>${percentAudio}%</span> accuracy</h4>
            <h4><span>${inRowAudio}</span> in a row</h4>
          </div>
          <div class="stat-wrapper__today-game">
            <h3 class="stat-wrapper__today-name">Sprint</h3>
            <h4><span>${newWordSprint}</span> new words</h4>
            <h4><span>${percentSprint}%</span> accuracy</h4>
            <h4><span>${inRowSprint}</span> in a row</h4>
          </div>
           <div class="stat-wrapper__today-game">
            <h3 class="stat-wrapper__today-name">Statistics by words</h3>
            <h4><span>${Number(newWordAudio) + Number(newWordSprint)} </span> new words</h4>
            <h4><span>${learnWords} </span> learned words</h4>
            <h4><span>${percentGames}% </span> accuracy</h4>
          </div>
        </div>    
      </div>
    </div>`;

  }
}
export default Statistics;
