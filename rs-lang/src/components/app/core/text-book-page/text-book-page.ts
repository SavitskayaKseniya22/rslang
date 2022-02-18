import ApiService from '../../api-service/api-service'
import ConrolGame from '../../audioCallGame/controlgame'
import { Word } from '../../interfaces/interfaces'
import { Sprint } from '../../sprint/sprint'
import './text-book-page.css'

class TextBookPage {
  apiService: ApiService
  curPage: number
  curGrp: number
  showDifficult: boolean
  pageWordsArr: Word[]
  constructor(apiService: ApiService) {
    this.apiService = apiService
    this.curPage = 0
    this.curGrp = 0
    this.showDifficult = false
    this.pageWordsArr = []
  }
  async render() {
    document.querySelector('.main').innerHTML = `<div class="textbook-container">
        <audio src='' class="tb-tts"></audio>
        <div class="tb-mini-game-select">
            <button class="tb-minigame" data-game-name="sprint"><i class="fa-solid fa-stopwatch"></i> sprint</button>
            <button class="tb-minigame" data-game-name="audio-challenge"><i class="fa-solid fa-music"></i> audio-challenge</button>
        </div>
        <div class="tb-pagination">
        <h3>Pages</h3>
        <div>
        <button data-direction="left" class="pagination-button"><i data-direction="left" class="fas fa-caret-left"></i></button>
            <input type="number" min="1" max="30" value="${this.curPage + 1}" class="page-num">
            <button data-direction="right" class="pagination-button"><i data-direction="right" class="fas fa-caret-right"></i></button>
        </div>
            
        </div>
        <div class="tb-group-select">
        <h3>Levels</h3>
            <button class="group-select" data-grp="0">1</button>
            <button class="group-select" data-grp="1">2</button>
            <button class="group-select" data-grp="2">3</button>
            <button class="group-select" data-grp="3">4</button>
            <button class="group-select" data-grp="4">5</button>
            <button class="group-select" data-grp="5">6</button>
        </div>
        <div class="tb-words">
        </div>
    </div>`
    if (!this.showDifficult) {
      document.querySelector(`[data-grp="${this.curGrp}"]`).classList.add('tb-group-selected')
    }
    await this.getWords()
    if (this.apiService.user !== null && this.apiService.user !== undefined) {
      document.querySelector('.tb-group-select').innerHTML += '<button class="group-select difficult-select">D</button>'

      if (this.showDifficult) {
        document.querySelector('.difficult-select').classList.add('tb-group-selected')
      }
      await this.checkWords()
    }
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
            '20'
          )
          this.pageWordsArr = words
          words.forEach((word) => {
            this.drawWord(word)
          })
        }
        await this.checkWords()
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
    <input type="checkbox" id="tb-wrd-desc-${id}" name="description">
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
    <label for="tb-wrd-desc-${id}" class="tb-wrd-desc button">description</label>
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
    document.querySelector('.page-num').addEventListener('input', async (e) => {
      const target = e.target as HTMLInputElement
      this.curPage = Number(target.value) -1
      await this.getWords()
      this.addControls()
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

    document.querySelectorAll('.tb-minigame').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const target = e.target as HTMLButtonElement
        const gameArr = await this.composeGameArr()
        if (target.dataset.gameName === 'sprint') {
          const page = new Sprint(1, this.apiService, gameArr)
          window.location.hash = `#${target.dataset.gameName}`
          page.render()
        } else if (target.dataset.gameName === 'audio-challenge') {
          new ConrolGame(-1, -1, gameArr)
          window.location.hash = 'audio-challenge'
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
          const date = target.dataset.date
          const dateObj = new Date()
          const dateStr = `${dateObj.getDate()}/${dateObj.getMonth()}/${dateObj.getFullYear()}`
          if (target.classList.contains('tb-add-difficult-btn')) {
            const id = target.dataset.tbDiffid
            await this.MarkAsDIfficult(id, date, dateStr)
          }
          if (target.classList.contains('tb-add-learned-btn')) {
            const id = target.dataset.tbLearnid
            await this.MarkAsLearned(id, date, dateStr)
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
    ;(document.querySelector('.page-num') as HTMLInputElement).value = `${this.curPage + 1}`
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
  async MarkAsLearned(id: string, date: string, dateStr: string) {
    const wordDiv = document.querySelector(`[data-tb-wrd-id="${id}"]`)
    const wordProgress = wordDiv.querySelector(`.tb-learning-progress`)
    try {
      if (
        wordDiv.classList.contains('tb-difficult-word') ||
        wordDiv.classList.contains('tb-learned-word') ||
        wordDiv.classList.contains('tb-normal-word')
      ) {
        this.apiService.requestUpdateUserWord(this.apiService.user.userId, id, {
          difficulty: 'learned',
          optional: { timesGuessed: 3, timesMax: 3, dateEncountered: date, dateLearned: dateStr },
        })
      } else {
        // console.log({ timesGuessed: 3, timesMax: 3, dateEncountered: Date.now(), dateLearned: Date.now() })
        this.apiService.requestAddUserWord(this.apiService.user.userId, id, {
          difficulty: 'learned',
          optional: { timesGuessed: 3, timesMax: 3, dateEncountered: '0', dateLearned: dateStr },
        })
        // console.log({ timesGuessed: 3, timesMax: 3, dateEncountered: Date.now(), dateLearned: Date.now() })
      }
      wordDiv.classList.add('tb-learned-word')
      wordDiv.classList.remove('tb-normal-word')
      wordDiv.classList.remove('tb-difficult-word')
      wordProgress.textContent ="3/3"
      if (this.showDifficult === true) {
        //checking if the difficult words only page shloulld be rendered
        wordDiv.remove()
      }
      this.checkWords()
    } catch (err) {
      const error = err as Error
      await this.handleUserError(error)
    }
  }
  async MarkAsDIfficult(id: string, date: string, dateStr: string) {
    try {
      const wordDiv = document.querySelector(`[data-tb-wrd-id="${id}"]`)
      const wordProgress = wordDiv.querySelector(`.tb-learning-progress`)
      if (
        wordDiv.classList.contains('tb-difficult-word') ||
        wordDiv.classList.contains('tb-learned-word') ||
        wordDiv.classList.contains('tb-normal-word')
      ) {
        await this.apiService.requestUpdateUserWord(this.apiService.user.userId, id, {
          difficulty: 'difficult',
          optional: { timesGuessed: 0, timesMax: 5, dateEncountered: date, dateLearned: '0' },
        })
      } else {
        await this.apiService.requestAddUserWord(this.apiService.user.userId, id, {
          difficulty: 'difficult',
          optional: { timesGuessed: 0, timesMax: 5, dateEncountered: '0', dateLearned: '0' },
        })
      }
      wordDiv.classList.remove('tb-learned-word')
      wordDiv.classList.remove('tb-normal-word')
      wordDiv.classList.add('tb-difficult-word')
      wordProgress.textContent = `0/5`
      if (this.showDifficult === true) {
        //checking if the difficult words only page shloulld be rendered
        await this.apiService.requestUpdateUserWord(this.apiService.user.userId, id, {
          difficulty: 'normal',
          optional: { timesGuessed: 0, timesMax: 3, dateEncountered: date, dateLearned: '0' },
        })
        wordDiv.remove()
      }
      this.checkWords()
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
      const date = word.userWord ? word.userWord.optional.dateEncountered : null
      const progress = word.userWord ? `${word.userWord.optional.timesGuessed}` : '0'
      const max = word.userWord ? `${word.userWord.optional.timesMax}` : '3'
      const markStr = this.showDifficult === true ? 'Mark as normal' : 'Mark as difficult' //checking if the difficult words only page shloulld be rendered
      document.querySelector(`[data-tb-wrd-info="${id}"]`).innerHTML += `
    <div data-tb-useid="${id}" class="tb-user-functionality">
    <button data-tb-diffid="${id}" data-date="${date}" class="tb-add-difficult-btn">${markStr}</button>
     <div class="tb-learning-progress data-tb-progressId = "${id}">${progress}/${max}</div>
    <button data-tb-learnid="${id}" data-date="${date}" class="tb-add-learned-btn">Mark as Learned</button>
</div>
    `
      if (word.userWord) {
        if (['difficult', 'learned', 'normal'].includes(word.userWord.difficulty)) {
          document.querySelector(`[data-tb-wrd-id="${id}"]`).classList.add(`tb-${word.userWord.difficulty}-word`)
        }
      }
    }
  }
  async composeGameArr() {
    let gameArr
    if (this.apiService.user !== null && this.apiService.user !== undefined) {
      gameArr = await this.apiService.requestGetAggregatedFIlter(
        this.apiService.user.userId,
        `{"$and":[{"page":${this.curPage}}, {"group":${this.curGrp}}, {"$or":[{"userWord.difficulty":"difficult"}, {"userWord.difficulty":"normal"}, {"userWord": null}]}]}`
      )
      if (gameArr.length < 20) {
        const supplementaryWrds = await this.apiService.requestGetAggregatedFIlter(
          this.apiService.user.userId,
          `{"$and":[{"page":{"$lt": ${this.curPage}}}, {"group":${this.curGrp}}, {"$or":[{"userWord.difficulty":"difficult"}, {"userWord.difficulty":"normal"}, {"userWord": null}]}]}`
        )
        const slice =
          supplementaryWrds.length > 20 - gameArr.length
            ? supplementaryWrds.slice(0, 20 - gameArr.length)
            : supplementaryWrds
        gameArr = gameArr.concat(slice)
      }
      return gameArr
    } else {
      gameArr = await this.apiService.requestWords(this.curGrp, this.curPage)
    }
    return gameArr
  }
  async checkWords() {
    this.pageWordsArr = await this.apiService.requestGetAggregatedFIlter(
      this.apiService.user.userId,
      `{"$and":[{"page":${this.curPage}}, {"group":${this.curGrp}}, {"userWord.difficulty":"learned"}]}`
    )
    document.querySelectorAll('.tb-minigame').forEach((btn) => {
      let button = btn as HTMLButtonElement
      button.disabled = false
      button.classList.remove('tb-disabled-minigame-btn')
      document.querySelector('.page-num').classList.remove('tb-finished-page')
      ;(document.querySelector('.page-num') as HTMLInputElement).disabled = false
      if ( this.showDifficult) {
        button.disabled = true
        button.classList.add('tb-disabled-minigame-btn')
        ;(document.querySelector('.page-num') as HTMLInputElement).disabled = true
        document.querySelector('.page-num').classList.add('tb-finished-page')
      }
      if(this.pageWordsArr.length === 20 ){
        button.disabled = true
        button.classList.add('tb-disabled-minigame-btn')
      }
    })
  }
}

export default TextBookPage
