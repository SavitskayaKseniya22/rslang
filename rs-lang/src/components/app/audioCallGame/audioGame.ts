import { Question, Word } from '../interfaces/interfaces'
import BasicQuestion from './basicQuestion'
import ConrolGame from './controlgame'
import ResultRaund from './resultRaund'

class AudioGame {
  count: number
  trueAnswer: string
  arrayQuestions: Question[]
  arrayTrueWords: Word[]
  arrayNumberTrueAnswers: number[]
  arrayNumberFalseAnswers: number[]
  groupAgain: number
  pageAgain: number
  countSpace: number
  countInRow: number
  countKey: number
  arrayCountInRow: number[] = []
  player = document.createElement('audio')
  constructor(data: Question[], arrayTrueWords: Word[], group: number, page: number) {
    this.groupAgain = group
    this.pageAgain = page
    this.arrayNumberTrueAnswers = []
    this.arrayNumberFalseAnswers = []
    this.arrayTrueWords = arrayTrueWords
    this.count = 0
    this.countSpace = 0
    this.countKey = 0
    this.countInRow = 0
    this.arrayQuestions = data
    this.startGame(this.arrayQuestions[0])
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Digit1' && this.count < this.arrayQuestions.length) {
        this.addAnswerFromKeyboard(0)
      } else if (event.code === 'Digit2' && this.count < this.arrayQuestions.length) {
        this.addAnswerFromKeyboard(1)
      } else if (event.code === 'Digit3' && this.count < this.arrayQuestions.length) {
        this.addAnswerFromKeyboard(2)
      } else if (event.code === 'Digit4' && this.count < this.arrayQuestions.length) {
        this.addAnswerFromKeyboard(3)
      } else if (event.code === 'Digit5' && this.count < this.arrayQuestions.length) {
        this.addAnswerFromKeyboard(4)
      } else if (event.code === 'Space' && this.count < this.arrayQuestions.length) {
        event.preventDefault()
        this.countSpace++
        if (this.countSpace === 1) {
          this.showAnswer()
        } else if (this.countSpace === 2) {
          this.changeQuestion()
        }
      }
    })
  }
  startGame(data: Question) {
    new BasicQuestion().renderQuestion(data)
    this.addEventListenerForButtonAction()
    this.addEventListenerForWrapperAnswers()
    this.trueAnswer = data.truthyAnswer.wordTranslate
    this.addSoundAnswer(`http://localhost:3000/${data.truthyAnswer.audio}`)
    this.addEventListenerForBigIconSound(`http://localhost:3000/${data.truthyAnswer.audio}`)
    this.addEventListenerForSmallIconSound(`http://localhost:3000/${data.truthyAnswer.audio}`)
  }
  addAnswerFromKeyboard(count: number) {

    const answers = document.querySelectorAll('.answer')
    if (this.countKey === 0) {
      this.countSpace++
      if (this.countSpace === 2) {
        this.countSpace = 1
      }
      if (this.arrayQuestions[this.count].truthyAnswer.wordTranslate !== answers[count].innerHTML) {
        this.addMarkFalseAnswer(<HTMLElement>document.querySelectorAll('.answer')[count])
        this.arrayNumberFalseAnswers.push(this.count)
        this.addSoundAnswer(`images/false-call.mp3`)
        this.showTrueAnswer()
      } else {
        this.addMarkTrueAnswer(<HTMLElement>answers[count])
        this.arrayNumberTrueAnswers.push(this.count)
        this.addSoundAnswer(`images/true-call.mp3`)

      }
      this.addAtributeDisabled()
      this.addAnswer()
      this.countKey++
    }

  }
  addSoundAnswer(src: string) {
    this.player.setAttribute('src', src)
    this.player.play()
  }
  addEventListenerForWrapperAnswers() {
    const wrapperForAnswers = document.querySelector('.wrapper-answers')
    wrapperForAnswers.addEventListener('click', (event) => {
      if ((<HTMLElement>event.target).innerText === this.trueAnswer) {
        this.countSpace++
        this.countInRow++
        this.arrayCountInRow.push(this.countInRow)
        this.addSoundAnswer(`images/true-call.mp3`)
        this.arrayNumberTrueAnswers.push(this.count)
        this.addMarkTrueAnswer(<HTMLElement>event.target)
        this.addAnswer()
        this.addAtributeDisabled()
      } else if ((<HTMLElement>event.target).innerText !== this.trueAnswer && (<HTMLElement>event.target).classList[0] === "answer") {
        this.countSpace++
        this.countInRow = 0
        this.addSoundAnswer(`images/false-call.mp3`)
        this.arrayNumberFalseAnswers.push(this.count)
        this.addMarkFalseAnswer(<HTMLElement>event.target)
        this.addAnswer()
        this.addAtributeDisabled()
        this.showTrueAnswer()
      }
    })
  }
  addAtributeDisabled() {
    const buttonsAnswer = document.querySelectorAll('.answer')
    buttonsAnswer.forEach((item) => {
      item.setAttribute('disabled', '')
    })
  }
  addAnswer() {
    const wrapperAnswer = document.querySelector('.wrapper-answer')
    const voiceIcon = document.querySelector('.voice-icon')
    const buttonActive = document.querySelector('.button-active')
    const buttonNext = document.querySelector('.button-next')
    wrapperAnswer.classList.add('flex')
    voiceIcon.classList.add('none')
    buttonActive.classList.add('none')
    buttonNext.classList.add('initial')
    this.addEventListenerForButtonNext()
  }
  addMarkFalseAnswer(element: HTMLElement) {
    element.style.border = '5px solid red'
  }
  addMarkTrueAnswer(element: HTMLElement) {
    element.style.border = '5px solid green'
  }
  showAnswer() {
    this.countKey++
    const answers = document.querySelectorAll('.answer')
    this.countInRow = 0
    this.addSoundAnswer(`images/false-call.mp3`)
    this.addAtributeDisabled()
    this.addAnswer()
    this.arrayNumberFalseAnswers.push(this.count)
    answers.forEach((answer) => {
      if (answer.innerHTML === this.arrayQuestions[this.count].truthyAnswer.wordTranslate) {
        this.addMarkTrueAnswer(<HTMLElement>answer)
      }
    })
  }
  showTrueAnswer() {
    document.querySelectorAll(".button-answer").forEach((word) => {
      if (word.innerHTML === this.arrayQuestions[this.count].truthyAnswer.wordTranslate) {
        this.addMarkTrueAnswer((<HTMLElement>word))
      }
    });
  }
  changeQuestion() {
    this.countSpace = 0
    this.countKey = 0
    this.count++
    if (this.count < this.arrayQuestions.length) {
      this.startGame(this.arrayQuestions[this.count])
    } else {
      new ResultRaund(
        this.arrayTrueWords,
        this.arrayNumberTrueAnswers,
        this.arrayNumberFalseAnswers,
        this.arrayCountInRow
      )
      this.addEventListenerForResultWrapper()
      this.addEventListenerForButtonPlayAgain()
    }
  }
  addEventListenerForButtonAction() {
    const buttonActive = document.querySelector('.button-active')
    buttonActive.addEventListener('click', () => {
      this.countSpace++
      this.showAnswer()
    })
  }
  addEventListenerForButtonNext() {
    const buttonNext = document.querySelector('.button-next')
    buttonNext.addEventListener('click', () => {
      this.changeQuestion()
    })
  }
  addEventListenerForBigIconSound(src: string) {
    const voiceIcon = document.querySelector('.voice-icon')
    voiceIcon.addEventListener('click', () => {
      this.addSoundAnswer(src)
    })
  }
  addEventListenerForSmallIconSound(src: string) {
    const voiceIcon = document.querySelector('.voice-icon-small')
    voiceIcon.addEventListener('click', () => {
      this.addSoundAnswer(src)
    })
  }
  addEventListenerForResultWrapper() {
    const resultWrapper = document.querySelectorAll('.voice-icon-result')
    resultWrapper.forEach((item) => {
      item.addEventListener('click', () => {
        this.addSoundAnswer(`http://localhost:3000/${item.id}`)
      })
    })
  }
  addEventListenerForButtonPlayAgain() {
    const button = document.querySelector('.button-play-again')
    button.addEventListener('click', () => {
      new ConrolGame(this.groupAgain, this.pageAgain)
    })
  }
}
export default AudioGame
