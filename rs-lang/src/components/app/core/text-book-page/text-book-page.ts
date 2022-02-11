import ApiService from '../../api-service/api-service'
import { Word } from '../../interfaces/interfaces'
import './text-book-page.css'

class TextBookPage {
  apiService: ApiService
  curPage: number
  curGrp: number
  showDifficult: boolean
  constructor(apiService: ApiService) {
    this.apiService = apiService
    this.curPage = 0
    this.curGrp = 0
    this.showDifficult = false
  }
  async render() {
    document.querySelector('.main').innerHTML = `<div class="textbook-container">
        <audio src='' class="tb-tts"></audio>
        <div class="tb-mini-game-select">
            <button disabled class="tb-minigame"><i class="fas fa-running"></i> sprint</button>
            <button disabled class="tb-minigame"><i class="fas fa-volume-up"></i> audio-challenge</button>
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
    if (this.apiService.user !== null && this.apiService.user !== undefined) {
      document.querySelector('.tb-group-select').innerHTML += '<div class="group-select difficult-select">D</div>'
      document.querySelectorAll('.tb-minigame').forEach((btn) => {
        let button = btn as HTMLButtonElement
        button.disabled = false
      })
    }
    await this.getWords()
    this.addListeners()
    this.addControls()
  }
  async getWords() {
    try {
      document.querySelector(`.tb-words`).innerHTML = ``
      if (this.apiService.user !== null && this.apiService.user !== undefined) {
        if (this.showDifficult === true) {
          //checking if the difficult words only page shloulld be rendered
          const words: Word[] = await this.apiService.requestGetAggregatedFIlter(
            this.apiService.user.userId,
            `{"$and":[{"userWord.difficulty":"difficult"}]}`
          )
          words.forEach((word) => {
            this.drawWord(word)
          })
        } else {
          const words: Word[] = await this.apiService.requestGetUserAgregatedPageGrp(
            this.apiService.user.userId,
            String(this.curGrp),
            String(this.curPage),
            '20',
          )
          words.forEach((word) => {
            this.drawWord(word)
          })
        }
      } else {
        const words: Word[] = await this.apiService.requestWords(this.curGrp, this.curPage)
        words.forEach((word) => {
          this.drawWord(word)
        })
      }
    } catch (err) {
      const error = err as Error
      await this.handleUserError(error)
    }
  }
  drawWord(word: Word) {
    try {
      const id = word.id || word._id
      document.querySelector(`.tb-words`).innerHTML += `
    <div class="tb-word" data-tb-wrd-id=${id}>
    <img class="tb-img" src=${this.apiService.apiUrl}/${word.image}>
    <div data-tb-wrd-info=${id} class="tb-word-info">
    <div class="tb-word-title-translation-pronounciation">
        <h3 class="tb-word-title">${word.word} ${word.transcription}</h3>
        <h3 class="tb-word-translation">${word.wordTranslate}</h3>
        <button class="pronounce" data-tb-audio-btn-id=${id} data-audio-paths="${this.apiService.apiUrl}/${word.audio},${this.apiService.apiUrl}/${word.audioMeaning},${this.apiService.apiUrl}/${word.audioExample}"><i data-audio-paths="${this.apiService.apiUrl}/${word.audio},${this.apiService.apiUrl}/${word.audioMeaning},${this.apiService.apiUrl}/${word.audioExample}" data-tb-audio-btn-id=${id} class="fas fa-volume-up"></i></button>
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
<audio src=${this.apiService.apiUrl}/${word.audio} data-audio-paths="${this.apiService.apiUrl}/${word.audio},${this.apiService.apiUrl}/${word.audioMeaning},${this.apiService.apiUrl}/${word.audioExample}" data-tb-p-audio-id=${id} data-tb-audio-id=${id}></audio>
</div>
    `
      this.drawUserWord(word)
    } catch (err) {
      const error = err as Error
      this.handleUserError(error)
    }
  }

  addListeners() {
    document.querySelectorAll('.pagination-button').forEach((elem) => {
      elem.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement
        this.switchPage(target.dataset.direction)
      })
    })
    document.querySelectorAll('.group-select').forEach((div) => {
      div.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement
        document.querySelector('.tb-group-selected').classList.remove('tb-group-selected')
        target.classList.add('tb-group-selected')
        if (!target.classList.contains(`difficult-select`)) {
          document.querySelectorAll('.pagination-button').forEach((btn) => {
            const elem = btn as HTMLButtonElement
            elem.disabled = false
          })
          this.curGrp = Number(target.dataset.grp)
          this.showDifficult = false
          await this.getWords()
          this.addControls()
        } else {
          this.showDifficult = true // marking the group as special for difficult words only
          document.querySelectorAll('.pagination-button').forEach((btn) => {
            const elem = btn as HTMLButtonElement
            elem.disabled = true
          })
          await this.getWords()
          this.addControls()
        }
      })
    })
  }
  addControls() {
    document.querySelectorAll('.pronounce').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLElement
        this.playAudio(target.dataset.audioPaths)
      })
    })
    if (this.apiService.user !== null && this.apiService.user !== undefined) {
      document.querySelectorAll('.tb-user-functionality').forEach((div) => {
        div.addEventListener('click', async (e) => {
          const target = e.target as HTMLElement
          if (target.classList.contains('tb-add-difficult-btn')) {
            const id = target.dataset.tbDiffid

            await this.MarkAsDIfficult(id)
          }
          if (target.classList.contains('tb-add-learned-btn')) {
            const id = target.dataset.tbLearnid

            await this.MarkAsLearned(id)
          }
        })
      })
    }
  }
  async switchPage(direction: string) {
    if (direction === 'right' && this.curPage < 29) {
      this.curPage++
    }

    if (direction === 'left' && this.curPage > 0) {
      this.curPage--
    }
    document.querySelector('.page-num').textContent = `${this.curPage + 1}`
    await this.getWords()
    this.addControls()
  }
  playAudio(paths: string) {
    const playlist = paths.split(',')
    const audio = document.querySelector('.tb-tts') as HTMLAudioElement
    audio.pause()
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
  }
  async MarkAsLearned(id: string) {
    const wordDiv = document.querySelector(`[data-tb-wrd-id="${id}"]`)
    try {
      if (
        wordDiv.classList.contains('tb-difficult-word') ||
        wordDiv.classList.contains('tb-learned-word') ||
        wordDiv.classList.contains('tb-normal-word')
      ) {
        this.apiService.requestUpdateUserWord(this.apiService.user.userId, id, {
          difficulty: 'learned',
          optional: { timesGuessed: 0, timesMax: 3 },
        })
      } else {
        this.apiService.requestAddUserWord(this.apiService.user.userId, id, {
          difficulty: 'learned',
          optional: { timesGuessed: 0, timesMax: 3 },
        })
      }
      wordDiv.classList.add('tb-learned-word')
      wordDiv.classList.remove('tb-normal-word')
      wordDiv.classList.remove('tb-difficult-word')
      if (this.showDifficult === true) {
        //checking if the difficult words only page shloulld be rendered
        wordDiv.remove()
      }
    } catch (err) {
      const error = err as Error
      await this.handleUserError(error)
    }
  }
  async MarkAsDIfficult(id: string) {
    try {
      const wordDiv = document.querySelector(`[data-tb-wrd-id="${id}"]`)
      if (
        wordDiv.classList.contains('tb-difficult-word') ||
        wordDiv.classList.contains('tb-learned-word') ||
        wordDiv.classList.contains('tb-normal-word')
      ) {
        await this.apiService.requestUpdateUserWord(this.apiService.user.userId, id, {
          difficulty: 'difficult',
          optional: { timesGuessed: 0, timesMax: 5 },
        })
      } else {
        await this.apiService.requestAddUserWord(this.apiService.user.userId, id, {
          difficulty: 'difficult',
          optional: { timesGuessed: 0, timesMax: 5 },
        })
      }
      wordDiv.classList.remove('tb-learned-word')
      wordDiv.classList.remove('tb-normal-word')
      wordDiv.classList.add('tb-difficult-word')
      if (this.showDifficult === true) {
        //checking if the difficult words only page shloulld be rendered

        await this.apiService.requestUpdateUserWord(this.apiService.user.userId, id, {
          difficulty: 'normal',
          optional: { timesGuessed: 0, timesMax: 3 },
        })
        wordDiv.remove()
      }
    } catch (err) {
      const error = err as Error
      await this.handleUserError(error)
    }
  }
  async handleUserError(error: Error) {
    if (error.message.includes('401')) {
      await this.apiService.updateToken()
    } else {
      alert(error)
    }
  }
  drawUserWord(word: Word) {
    const id = word.id || word._id
    if (this.apiService.user !== null && this.apiService.user !== undefined) {
      const progress = word.userWord ? `${word.userWord.optional.timesGuessed}` : '0'
      const max = word.userWord ? `${word.userWord.optional.timesMax}` : '3'
      const markStr = this.showDifficult === true ? 'Mark as normal' : 'Mark as difficult' //checking if the difficult words only page shloulld be rendered
      document.querySelector(`[data-tb-wrd-info="${id}"]`).innerHTML += `
    <div data-tb-useid="${id}" class="tb-user-functionality">
    <button data-tb-diffid="${id}" class="tb-add-difficult-btn">${markStr}</button>
     <div class="tb-learning-progress">${progress}/${max}</div>
    <button data-tb-learnid="${id}" class="tb-add-learned-btn">Mark as Learned</button>
</div>
    `
      if (word.userWord) {
        if (['difficult', 'learned', 'normal'].includes(word.userWord.difficulty)) {
          document.querySelector(`[data-tb-wrd-id="${id}"]`).classList.add(`tb-${word.userWord.difficulty}-word`)
        }
      }
    }
  }
}

export default TextBookPage
