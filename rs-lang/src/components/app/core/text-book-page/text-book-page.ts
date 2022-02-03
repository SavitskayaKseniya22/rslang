import ApiService from '../../api-service/api-service'
import { Word } from '../../interfaces/interfaces'
import './text-book-page.css'

class TextBookPage {
  service: ApiService
  curPage: number
  curGrp: number
  constructor(service: ApiService) {
    this.service = service
    this.curPage = 0
    this.curGrp = 0
  }
  render() {
    document.querySelector('.main').innerHTML = `<div class="textbook-container">
        <div class="tb-mini-game-select">
            <div class="tb-minigame"><i class="fas fa-running"></i> sprint</div>
            <div class="tb-minigame"><i class="fas fa-volume-up"></i> audio-challenge</div>
        </div>
        <div class="tb-pagination">
            <button data-direction="left" class="pagination-button"><i data-direction="left" class="fas fa-caret-left"></i></button>
            <div class="page-num">1</div>
            <button data-direction="right" class="pagination-button"><i data-direction="right" class="fas fa-caret-right"></i></button>
        </div>
        <div class="tb-group-select">
        <p>groups</p>
            <div class="group-select tb-group-selected" data-grp="0">1</div>
            <div class="group-select" data-grp="1">2</div>
            <div class="group-select" data-grp="2">3</div>
            <div class="group-select" data-grp="3">4</div>
            <div class="group-select" data-grp="4">5</div>
            <div class="group-select" data-grp="5">6</div>
        </div>
        <div class="tb-words">
            
        </div>
        
        
    </div>`
    this.getWords()
    this.addListeners()
  }

  async getWords() {
    document.querySelector(`.tb-words`).innerHTML = ``
    const words = await this.service.requestWords(this.curGrp, this.curPage)
    words.forEach((word) => {
      this.drawWord(word)
    })
  }
  drawWord(word: Word) {
    document.querySelector(`.tb-words`).innerHTML += `
    <div class="tb-word" data-tb-wrd-id=${word.id}>
    <img class="tb-img" src=${this.service.apiUrl}/${word.image}>
    <div class="tb-word-info">
    <div class="tb-word-title-translation-pronounciation">
        <h3 class="tb-word-title">${word.word} ${word.transcription}</h3>
        <h3 class="tb-word-translation">${word.wordTranslate}</h3>
        <button class="pronounce" data-tb-audio-btn-id=${word.id}><i class="fas fa-volume-up"></i></button>
    </div>
    <div class="tb-word-definition">
        <p class="tb-definition-english">${word.textMeaning}</p>
        <p class="tb-definition-translation">${word.textMeaningTranslate}</p>
    </div>
    <div class="tb-word-sentence">
        <p class="tb-sentence-english">${word.textExample}</p>
        <p class="tb-sentence-translation">${word.textExampleTranslate}</p>
    </div>
    </div>
<audtio src=${this.service.apiUrl}/${word.audio} data-tb-audio-id=${word.id} data-tb-audio-num="0"></audtio>
<audtio src=${this.service.apiUrl}/${word.audioMeaning} data-tb-audio-id=${word.id} data-tb-audio-num="1"></audtio>
<audtio src=${this.service.apiUrl}/${word.audioExample} data-tb-audio-id=${word.id} data-tb-audio-num="2"></audtio>
</div>
    `
  }

  addListeners() {
    document.querySelectorAll('.pagination-button').forEach((elem) => {
      elem.addEventListener('click', (e) => {
        console.log('I got clicked')
        const target = e.target as HTMLButtonElement
        this.switchPage(target.dataset.direction)
      })
    })
    document.querySelectorAll('.group-select').forEach((div)=>{
        div.addEventListener('click', (e)=>{
            const target = e.target as HTMLElement
            document.querySelector('.tb-group-selected').classList.remove('tb-group-selected')
            target.classList.add('tb-group-selected')
            this.curGrp = Number(target.dataset.grp)
            this.getWords()
        })
    })
  }
  switchPage(direction: string) {
    console.log(direction)
    if (direction === 'right' && this.curPage < 29) {
      this.curPage++
      document.querySelector('.page-num').textContent = `${this.curPage + 1}`
    }

    if (direction === 'left' && this.curPage > 0) {
      console.log('i work')
      this.curPage--
      document.querySelector('.page-num').textContent = `${this.curPage + 1}`
    }

    this.getWords()
  }
}

export default TextBookPage
