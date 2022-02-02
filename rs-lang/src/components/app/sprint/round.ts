import ApiService from '../api-service/api-service'

export class Round {
  sugestedWord: Word
  sugestedAnswer: Word
  service: ApiService

  constructor(service) {
    this.service = service
  }
  async getWords() {
    const words = await this.service.getWords(1, 1)
    return words
  }

  async makeRound() {
    const words = await this.getWords()
    this.sugestedWord = words[0]
    this.sugestedAnswer = words[1]
    return `<li><span class="sprint__words_suggested">${this.sugestedWord.word}</span></li>
    <li><span class="sprint__words_answered">${this.sugestedAnswer.word}</span></li>`
  }

  async renderRound() {
    const round = await this.makeRound()
    document.querySelector('.sprint__words').innerHTML = round
  }
}

interface Word {
  id: string
  group: 0
  page: 0
  word: 'string'
  image: 'string'
  audio: 'string'
  audioMeaning: 'string'
  audioExample: 'string'
  textMeaning: 'string'
  textExample: 'string'
  transcription: 'string'
  wordTranslate: 'string'
  textMeaningTranslate: 'string'
  textExampleTranslate: 'string'
}
