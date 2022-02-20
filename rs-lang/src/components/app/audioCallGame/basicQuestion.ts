import ImageIconVoice from './imageIconVoice'
import Button from './button'
import Answer from './answer'
import { Question, Word } from '../interfaces/interfaces'

class BasicQuestion {
  renderQuestion(question: Question, apiUrl: string) {
    const mainWrapper = document.createElement('div')
    const arrayAnswers = [question.truthyAnswer].concat(question.falsyAnswers)
    document.querySelector('.main').innerHTML = ''
    mainWrapper.classList.add('question')
    mainWrapper.append(
      this.addIconVoice(),
      this.addWrapperForAnswer(question.truthyAnswer.image, question.truthyAnswer.word, apiUrl),
      this.addAnswers(arrayAnswers),
      this.addButtonAction()
    )
    document.querySelector('.main').append(mainWrapper)
  }
  addIconVoice() {
    const wrapperForIconVoice = document.createElement('button')
    wrapperForIconVoice.append(new ImageIconVoice().addIconVoice('images/iconVoice.svg'))
    wrapperForIconVoice.classList.add('voice-icon')
    return wrapperForIconVoice
  }
  addWrapperForAnswer(pathToImage: string, word: string, apiUrl: string) {
    const wrapperForAnswersSmall = document.createElement('button')
    const wrapperForAnswer = document.createElement('div')
    const wrapperForAnswerContent = document.createElement('div')
    const wordAnswer = document.createElement('h3')
    wordAnswer.innerHTML = word
    wrapperForAnswersSmall.classList.add('voice-icon-small')
    wrapperForAnswersSmall.append(new ImageIconVoice().addIconVoice('images/iconVoiceSmall.svg'))
    wrapperForAnswerContent.classList.add('answer-content')
    wrapperForAnswerContent.classList.add('wrap-cont')
    wrapperForAnswerContent.append(wrapperForAnswersSmall, wordAnswer)
    wrapperForAnswer.classList.add('question', 'wrapper-answer')
    wrapperForAnswer.append(
      new ImageIconVoice().addIconVoice(`${apiUrl}/${pathToImage}`),
      wrapperForAnswerContent
    )
    return wrapperForAnswer
  }
  addAnswers(arrayAnswers: Word[]) {
    const wrapperForAnswers = document.createElement('div')
    const sortArrQuestions = this.shuffle([1, 2, 3, 4, 5].map((item, i) => arrayAnswers[i]))
    wrapperForAnswers.innerHTML = ''
    wrapperForAnswers.classList.add('wrapper-answers', 'answer-content')
    sortArrQuestions.forEach((item: Word, i) => {
      wrapperForAnswers.append(new Answer().addWrapperForAnswer(item, i))
    })
    return wrapperForAnswers
  }
  addButtonAction() {
    const wrapperForButton = document.createElement('div')
    const buttonActive = new Button({
      className: 'button-active',
      text: "I don't know",
    })
    const buttonNext = new Button({
      className: 'button-next',
      text: 'Next word',
    })
    wrapperForButton.append(buttonActive.element, buttonNext.element)
    return wrapperForButton
  }
  shuffle(arr: Word[]) {
    let j, temp
    for (let i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      temp = arr[j]
      arr[j] = arr[i]
      arr[i] = temp
    }
    return arr
  }
}
export default BasicQuestion
