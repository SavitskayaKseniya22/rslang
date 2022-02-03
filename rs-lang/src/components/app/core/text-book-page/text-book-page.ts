import ApiService from '../../api-service/api-service'
import { Word } from '../../interfaces/interfaces'
import './text-book-page.css'

class TextBookPage {
  service: ApiService
  curPage: number
  curGrp: number
  difficultWords: Word[] | undefined[]
  learnedWords: Word[] | undefined[]
  constructor(service: ApiService) {
    this.service = service
    this.curPage = 0
    this.curGrp = 0
    this.difficultWords = []
    this.learnedWords = []
  }
  async render() {
    document.querySelector('.main').innerHTML = `<div class="textbook-container">
        <audio src='' class="tb-tts"></audio>
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
    await this.getWords()
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
        <button class="pronounce" data-tb-audio-btn-id=${word.id} data-audio-paths="${this.service.apiUrl}/${word.audio},${this.service.apiUrl}/${word.audioMeaning},${this.service.apiUrl}/${word.audioExample}"><i data-audio-paths="${this.service.apiUrl}/${word.audio},${this.service.apiUrl}/${word.audioMeaning},${this.service.apiUrl}/${word.audioExample}" data-tb-audio-btn-id=${word.id} class="fas fa-volume-up"></i></button>
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
<audio src=${this.service.apiUrl}/${word.audio}  data-audio-paths="${this.service.apiUrl}/${word.audio},${this.service.apiUrl}/${word.audioMeaning},${this.service.apiUrl}/${word.audioExample}" data-tb-p-audio-id=${word.id} data-tb-audio-id=${word.id}></audio>
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
    document.querySelectorAll('.group-select').forEach((div) => {
      div.addEventListener('click', (e) => {
        const target = e.target as HTMLElement
        document.querySelector('.tb-group-selected').classList.remove('tb-group-selected')
        target.classList.add('tb-group-selected')
        this.curGrp = Number(target.dataset.grp)
        this.getWords()
      })
    })
    document.querySelectorAll('.pronounce').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLElement
        this.playAudio(target.dataset.audioPaths)
      })
    })
  }
  async switchPage(direction: string) {
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

    await this.getWords()
    this.addListeners()
  }
  playAudio(paths: string) {
    const playlist = paths.split(',')
    const audio = document.querySelector('.tb-tts') as HTMLAudioElement
    audio.pause()
    audio.src = ``
    audio.src = playlist[0]
    let count = 0
    audio.addEventListener('ended', function playSound(e) {
      count += 1
      audio.src = playlist[count]
      audio.play()
      if (count === 2) {
        e.target.removeEventListener('ended', playSound)
      }
    })
    audio.play()
    console.log(playlist)
    /*const pronounciation = document.querySelector(`[data-tb-p-audio-id="${id}"]`) as HTMLAudioElement
    const meaning = document.querySelector(`[data-tb-m-audio-id="${id}"]`) as HTMLAudioElement
    const example = document.querySelector(`[data-tb-ex-audio-id="${id}"]`) as HTMLAudioElement
    const playlist = [pronounciation, meaning, example]
    console.log(playlist)
    playlist.forEach((track, idx, arr) => {
      console.log(idx)
      if (idx < arr.length - 1) {
        console.log(playlist[idx + 1])
        track.addEventListener(
          'ended',
          () => {
            playlist[idx + 1].play()
          },
          { once: true }
        )
      }
    })
    pronounciation.play()*/
  }
}

export default TextBookPage
