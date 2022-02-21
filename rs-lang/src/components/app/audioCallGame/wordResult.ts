import { Word } from '../interfaces/interfaces'
import ImageIconVoice from './imageIconVoice'

class WordResult {
  addWrapperForWord(arrayTrueWords: Word[], count: number) {
    const wrapperForWord = document.createElement('div')
    const titleWord = document.createElement('h4')
    const buttonSound = document.createElement('button')
    const spanTranslateWord = document.createElement('span')
    if (arrayTrueWords.length > 0) {
      titleWord.innerHTML = arrayTrueWords[count].word
      spanTranslateWord.innerHTML = ` - ${arrayTrueWords[count].wordTranslate}`
      titleWord.append(spanTranslateWord)
      buttonSound.classList.add('voice-icon-result')
      buttonSound.setAttribute('id', arrayTrueWords[count].audio)
      buttonSound.prepend(new ImageIconVoice().addIconVoice('images/iconVoiceForResult.svg'))
      wrapperForWord.append(buttonSound, titleWord)
      wrapperForWord.classList.add('answer-content')
    }
    return wrapperForWord
  }
}
export default WordResult
