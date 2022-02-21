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
  groupThirdPartFalse: number
  pageThirdPartFalse: number
  groupFourthPartFalse: number
  pageFourthPartFalse: number
  apiService: ApiService
  apiServiceUser: ApiService
  user: UserTemplate
  wordsPerPage: number
  apiUrl: string
  bookQuestions: Word[]
  constructor(group = -1, page = -1, bookQuestions = [] as Word[]) {
    this.bookQuestions = bookQuestions
    this.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
    this.groupTrue = group === -1 ? this.bookQuestions[0].group : group
    this.pageTrue =
      page !== -1 ? page : page === -1 && group !== -1 ? this.randomInteger(0, 29) : this.bookQuestions[0].page
    this.wordsPerPage = 20
    this.apiService = new ApiService(this.user)
    this.apiUrl = this.apiService.apiUrl
    this.getParamsForRequest()
    if (this.user === null) {
      this.getQuestions()
    } else if (this.user !== null) {
      this.getQuestionsUser()
    }
  }
  async getQuestionsUser() {
    const trueWords =
      this.bookQuestions.length !== 0
        ? this.bookQuestions
        : await this.apiService.requestGetUserAgregatedPageGrp(
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
    const falseThirdPartWords = await this.apiService.requestGetUserAgregatedPageGrp(
      this.apiService.user.userId,
      this.groupThirdPartFalse.toString(),
      this.pageThirdPartFalse.toString(),
      this.wordsPerPage.toString()
    )
    const falseFourthPartWords = await this.apiService.requestGetUserAgregatedPageGrp(
      this.apiService.user.userId,
      this.groupFourthPartFalse.toString(),
      this.pageFourthPartFalse.toString(),
      this.wordsPerPage.toString()
    )
    const { arrayQuestions, arrayTrueWords } = this.createQuestions(
      trueWords,
      falseFirstPartWords,
      falseSecondPartWords,
      falseThirdPartWords,
      falseFourthPartWords
    )
    new AudioGame(arrayQuestions, arrayTrueWords, this.groupTrue, this.pageTrue, this.apiUrl)
  }
  async getQuestions() {
    const trueWords = await this.apiService.getAudioWords(this.groupTrue, this.pageTrue)
    const falseFirstPartWords = await this.apiService.getAudioWords(this.groupFirstPartFalse, this.pageFirstPartFalse)
    const falseSecondPartWords = await this.apiService.getAudioWords(
      this.groupSecondPartFalse,
      this.pageSecondPartFalse
    )
    const falseThirdPartWords = await this.apiService.getAudioWords(this.groupThirdPartFalse, this.pageThirdPartFalse)
    const falseFourthPartWords = await this.apiService.getAudioWords(
      this.groupFourthPartFalse,
      this.pageFourthPartFalse
    )
    const { arrayQuestions, arrayTrueWords } = this.createQuestions(
      trueWords,
      falseFirstPartWords,
      falseSecondPartWords,
      falseThirdPartWords,
      falseFourthPartWords
    )
    new AudioGame(arrayQuestions, arrayTrueWords, this.groupTrue, this.pageTrue, this.apiUrl)
  }
  createQuestions(
    arrayTrueWords: Word[],
    falseFirstPartWords: Word[],
    falseSecondPartWords: Word[],
    falseThirdPartWords: Word[],
    falseFourthPartWords: Word[]
  ) {
    const arrayFalseWords = falseFirstPartWords.concat(
      falseSecondPartWords.concat(falseThirdPartWords.concat(falseFourthPartWords))
    )
    const arrayQuestions = this.arraySplit(arrayFalseWords, arrayTrueWords.length).map((elem, i, arr) => {
      return { truthyAnswer: arrayTrueWords[i], falsyAnswers: arr[i] }
    })
    return { arrayQuestions, arrayTrueWords }
  }
  getParamsForRequest() {
    this.groupFirstPartFalse = this.getGroup(this.groupTrue)
    this.pageFirstPartFalse = this.getPage(this.pageTrue)
    this.groupSecondPartFalse = this.getGroup(this.groupFirstPartFalse)
    this.pageSecondPartFalse = this.getPage(this.pageFirstPartFalse)
    this.groupThirdPartFalse = this.getGroup(this.groupSecondPartFalse)
    this.pageThirdPartFalse = this.getPageThirdFalse(this.pageSecondPartFalse)
    this.groupFourthPartFalse = this.getGroup(this.groupThirdPartFalse)
    this.pageFourthPartFalse = this.getPageFourthFalse(this.pageThirdPartFalse)
  }
  getGroup(group: number) {
    if (group >= 0 && group < 5) {
      group += 1
    } else if (group === 5) {
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
  getPageThirdFalse(page: number) {
    if (page >= 0 && page !== 29) {
      page += 1
    } else if (page === 29) {
      page -= 3
    }
    return page
  }
  getPageFourthFalse(page: number) {
    if (page >= 0 && page !== 29) {
      page += 1
    } else if (page === 29) {
      page -= 4
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
