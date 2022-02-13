import AudioGame from './audioGame'
import ApiService from '../api-service/api-service'
import './audioCall.css'
import { UserTemplate, Word } from '../interfaces/interfaces'

class ConrolGame {
  groupTrue: number
  pageTrue: number
  groupFirstPartFalse: number
  pageFirstPartFalse: number
  groupSecondPartFalse: number
  pageSecondPartFalse: number
  apiService: ApiService
  apiServiceUser: ApiService
  user: UserTemplate
  wordsPerPage: number
  bookQuestions: Word[]
  constructor(group = -1, page = -1, bookQuestions = [] as Word[]) {
    this.bookQuestions = bookQuestions
    this.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
    this.groupTrue = group
    this.pageTrue = page !== -1 ? page : this.randomInteger(0, 29)
    this.wordsPerPage = 20
    this.apiService = new ApiService(this.user)
    this.getParamsForRequest()
    if (this.user === null) {
      this.getQuestions()
    } else if (this.user !== null && this.bookQuestions.length === 0) {
      try {
        this.getQuestionsUser()
      } catch (error) {
        this.apiService.requestUpdateToken(this.user.userId)
        this.getQuestionsUser()
      }
    } else if (this.user !== null && this.bookQuestions.length !== 0) {
      try {
        this.getQuestionsUserFromBook()
      } catch (error) {
        this.apiService.requestUpdateToken(this.user.userId)
        this.getQuestionsUserFromBook()
      }
    }
  }
  getQuestionsUserFromBook() {
    console.log('From book')
  }
  async getQuestionsUser() {
    const trueWords = await this.apiService.requestGetUserAgregatedPageGrp(
      this.apiService.user.userId,
      this.groupTrue.toString(),
      this.pageTrue.toString(),
      this.wordsPerPage.toString()
    )
    const falseFirstPartWords = await this.apiService.requestGetUserAgregatedPageGrp(
      this.apiService.user.userId,
      this.groupFirstPartFalse.toString(),
      this.pageFirstPartFalse.toString(),
      this.wordsPerPage.toString()
    )
    const falseSecondPartWords = await this.apiService.requestGetUserAgregatedPageGrp(
      this.apiService.user.userId,
      this.groupSecondPartFalse.toString(),
      this.pageSecondPartFalse.toString(),
      this.wordsPerPage.toString()
    )
    const { arrayQuestions, arrayTrueWords } = this.createQuestions(
      trueWords,
      falseFirstPartWords,
      falseSecondPartWords
    )
    new AudioGame(arrayQuestions, arrayTrueWords, this.groupTrue, this.pageTrue)
  }
  async getQuestions() {
    const trueWords = await this.apiService.getAudioWords(this.groupTrue, this.pageTrue)
    const falseFirstPartWords = await this.apiService.getAudioWords(this.groupFirstPartFalse, this.pageFirstPartFalse)
    const falseSecondPartWords = await this.apiService.getAudioWords(
      this.groupSecondPartFalse,
      this.pageSecondPartFalse
    )
    const { arrayQuestions, arrayTrueWords } = this.createQuestions(
      trueWords,
      falseFirstPartWords,
      falseSecondPartWords
    )
    new AudioGame(arrayQuestions, arrayTrueWords, this.groupTrue, this.pageTrue)
  }
  createQuestions(trueWords: Word[], falseFirstPartWords: Word[], falseSecondPartWords: Word[]) {
    const arrayFalseWords = falseFirstPartWords.concat(falseSecondPartWords)
    const randomNumberForArrayTrueWords = this.randomInteger(0, 1)
    const arrayTrueWords = randomNumberForArrayTrueWords === 0 ? trueWords.slice(0, 10) : trueWords.slice(9, 19)
    const arrayQuestions = this.arraySplit(arrayFalseWords, 10).map((elem, i, arr) => {
      return { truthyAnswer: arrayTrueWords[i], falsyAnswers: arr[i] }
    })
    return { arrayQuestions, arrayTrueWords }
  }
  getParamsForRequest() {
    this.groupFirstPartFalse = this.getGroup(this.groupTrue)
    this.pageFirstPartFalse = this.getPage(this.groupTrue)
    this.groupSecondPartFalse = this.getGroup(this.groupFirstPartFalse)
    this.pageSecondPartFalse = this.getGroup(this.pageFirstPartFalse)
  }
  getGroup(group: number) {
    if (group >= 0 && group !== 6) {
      group += 1
    } else if (group === 6) {
      group -= 1
    }
    return group
  }
  getPage(page: number) {
    if (page >= 0 && page !== 29) {
      page += 1
    } else if (page === 29) {
      page -= 1
    }
    return page
  }
  arraySplit(arr: Word[], c: number) {
    const result = new Array(c)
    for (let i = 0; i < c; ++i) {
      result[i] = []
    }
    for (let i = 0; i < arr.length; ++i) {
      result[i % c].push(arr[i])
    }
    return result
  }
  randomInteger(min: number, max: number) {
    const rand = min + Math.random() * (max + 1 - min)
    return Math.floor(rand)
  }
}
export default ConrolGame
