import ApiService from '../api-service/api-service'
import { UserTemplate, Word } from '../interfaces/interfaces'
import Button from './button'
import WordResult from './wordResult'

class ResultRaund {
  arrayTrueWords: Word[]
  arrayNumberTrueAnswers: number[]
  arrayNumberFalseAnswers: number[]
  user: UserTemplate
  apiServiceUser: ApiService
  constructor(
    arrayTrueWords: Word[],
    arrayNumberTrueAnswers: number[],
    arrayNumberFalseAnswers: number[],
    arrayCountInRow: number[]


  ) {
    this.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
    this.apiServiceUser = new ApiService(this.user)
    this.arrayTrueWords = arrayTrueWords
    this.arrayNumberTrueAnswers = arrayNumberTrueAnswers
    this.arrayNumberFalseAnswers = arrayNumberFalseAnswers
    document.querySelector('.main').innerHTML = ''
    document.querySelector('.main').append(this.addWrapperResult(arrayNumberTrueAnswers, arrayNumberFalseAnswers))
    if (this.user !== null) this.requestResultRaund()
    this.createStatistic(arrayCountInRow);
  }
  async createStatistic(arrayCountInRow: number[]) {
    arrayCountInRow.sort((a, b) => a - b);
    let countNewWord = this.arrayTrueWords.filter((word) => word.userWord !== undefined).length;
    let percentTrueAnswer = (this.arrayNumberTrueAnswers.length / this.arrayTrueWords.length) * 100;
    let inRow = arrayCountInRow[arrayCountInRow.length - 1];
    try {
      const userStatistics = await this.apiServiceUser.getUserStatistics(this.apiServiceUser.user.userId);
      const sprintStat = userStatistics.optional.sprintStat !== undefined ? userStatistics.optional.sprintStat : {};
      countNewWord = userStatistics.optional.audioStat.countNewWord + countNewWord;
      percentTrueAnswer = userStatistics.optional.audioStat.countNewWord < percentTrueAnswer ? percentTrueAnswer : userStatistics.optional.audioStat.countNewWord;
      inRow = userStatistics.optional.audioStat.inRow < inRow ? inRow : userStatistics.optional.audioStat.inRow;
      this.requestStatistics(sprintStat, countNewWord, percentTrueAnswer, inRow);
    } catch (error) {
      this.requestStatistics({}, countNewWord, percentTrueAnswer, inRow);
    }
  }
  requestStatistics(sprintStat: any, countNewWord: number, percentTrueAnswer: number, inRow: number) {
    this.apiServiceUser.requestUpdStatistics(
      this.apiServiceUser.user.userId,
      {
        learnedWords: 0,
        optional: {
          sprintStat: sprintStat,
          audioStat: {
            countNewWord: countNewWord,
            percentTrueAnswer: percentTrueAnswer,
            inRow: inRow,
          }
        }
      }
    );
  }
  requestResultRaund() {
    this.arrayTrueWords.forEach((word, i, words) => {
      if (word.userWord === undefined) {
        this.apiServiceUser.requestAddUserWord(this.apiServiceUser.user.userId, word._id, {
          difficulty: 'normal',
          optional: { timesGuessed: 1, timesMax: 3, dateEncountered: Date.now(), dateLearned: 0 },
        })
      } else {
        if (this.arrayNumberTrueAnswers.includes(i)) {
          this.requestUpdateUserWordForTrueAnswer(words, i)
        } else if (this.arrayNumberFalseAnswers.includes(i)) {
          this.requestUpdateUserWordForFalseAnswer(words, i)
        }
      }
    })
  }
  async requestUpdateUserWordForTrueAnswer(words: Word[], i: number) {
    const trueAnswer = await this.apiServiceUser.requestGetUserWord(this.apiServiceUser.user.userId, words[i]._id)
    if (trueAnswer.difficulty === 'difficult' || trueAnswer.difficulty === 'normal') {
      const timesMax = trueAnswer.optional.timesGuessed
      let timesGuessed = trueAnswer.optional.timesGuessed
      const date = trueAnswer.optional.dateEncountered
      timesGuessed++
      if (timesGuessed >= timesMax) {
        this.apiServiceUser.requestUpdateUserWord(this.apiServiceUser.user.userId, words[i]._id, {
          difficulty: 'learned',
          optional: { timesGuessed: timesGuessed, timesMax: 3, dateEncountered: date, dateLearned: Date.now() },
        })
      }
    } else if (trueAnswer.difficulty === 'learned') {
      const timesMax = trueAnswer.optional.timesGuessed
      const timesGuessed = trueAnswer.optional.timesGuessed
      const date = trueAnswer.optional.dateEncountered
      if (timesGuessed < timesMax) {
        this.apiServiceUser.requestUpdateUserWord(this.apiServiceUser.user.userId, words[i]._id, {
          difficulty: 'learned',
          optional: { timesGuessed: timesGuessed, timesMax: 3, dateEncountered: date, dateLearned: Date.now() },
        })
      }
    }
  }
  async requestUpdateUserWordForFalseAnswer(words: Word[], i: number) {
    const falseAnswer = await this.apiServiceUser.requestGetUserWord(this.apiServiceUser.user.userId, words[i]._id)
    if (falseAnswer.difficulty === 'difficult' || falseAnswer.difficulty === 'normal') {
      const difficulty = falseAnswer.difficulty
      const date = falseAnswer.optional.dateEncountered
      this.apiServiceUser.requestUpdateUserWord(this.apiServiceUser.user.userId, words[i]._id, {
        difficulty: difficulty,
        optional: { timesGuessed: 0, timesMax: 3, dateEncountered: date, dateLearned: 0 },
      })
    } else if (falseAnswer.difficulty === 'learned') {
      const date = falseAnswer.optional.dateEncountered
      this.apiServiceUser.requestUpdateUserWord(this.apiServiceUser.user.userId, words[i]._id, {
        difficulty: 'normal',
        optional: { timesGuessed: 0, timesMax: 3, dateEncountered: date, dateLearned: 0 },
      })
    }
  }
  addWrapperResult(arrayNumberTrueAnswers: number[], arrayNumberFalseAnswers: number[]) {
    const wrapperResult = document.createElement('div')
    const buttonAgain = new Button({
      className: 'button-play-again',
      text: 'Play again',
    })
    wrapperResult.append(
      this.addWrapperTrueResult(arrayNumberTrueAnswers),
      this.addWrapperFalseResult(arrayNumberFalseAnswers),
      buttonAgain.element
    )
    wrapperResult.classList.add('result-wrapper')
    return wrapperResult
  }
  addWrapperTrueResult(arrayNumberTrueAnswers: number[]) {
    const wrapperTrueResult = document.createElement('div')
    const titleWrapperTrueResult = document.createElement('h3')
    const spanWrapperTrueResult = document.createElement('span')
    titleWrapperTrueResult.innerHTML = 'Correct Answers'
    spanWrapperTrueResult.innerHTML = ` ${arrayNumberTrueAnswers.length.toString()}`
    titleWrapperTrueResult.append(spanWrapperTrueResult)
    wrapperTrueResult.prepend(titleWrapperTrueResult)
    arrayNumberTrueAnswers.forEach((item) =>
      wrapperTrueResult.append(new WordResult().addWrapperForWord(this.arrayTrueWords, item))
    )
    return wrapperTrueResult
  }
  addWrapperFalseResult(arrayNumberFalseAnswers: number[]) {
    const wrapperFalseResult = document.createElement('div')
    const titleWrapperFalseResult = document.createElement('h3')
    const spanWrapperFalseResult = document.createElement('span')
    titleWrapperFalseResult.innerHTML = 'Mistakes'
    spanWrapperFalseResult.innerHTML = ` ${arrayNumberFalseAnswers.length.toString()}`
    titleWrapperFalseResult.append(spanWrapperFalseResult)
    wrapperFalseResult.prepend(titleWrapperFalseResult)
    arrayNumberFalseAnswers.forEach((item) =>
      wrapperFalseResult.append(new WordResult().addWrapperForWord(this.arrayTrueWords, item))
    )
    return wrapperFalseResult
  }
}
export default ResultRaund
