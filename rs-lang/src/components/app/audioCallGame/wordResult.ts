import ImageIconVoice from "./imageIconVoice";
import { Word } from "./type";

class WordResult {
  wrapperForWord = document.createElement("div");
  titleWord = document.createElement("h4");
  buttonSound = document.createElement("button");
  spanTranslateWord = document.createElement("span");
  addWrapperForWord(arrayTrueWords: Word[], count: number) {
    if (arrayTrueWords.length > 0) {
      this.titleWord.innerHTML = arrayTrueWords[count].word;
      this.spanTranslateWord.innerHTML = ` - ${arrayTrueWords[count].wordTranslate}`;
      this.titleWord.append(this.spanTranslateWord);
      this.buttonSound.classList.add("voice-icon-result");
      this.buttonSound.setAttribute("id", arrayTrueWords[count].audio)
      this.buttonSound.prepend(new ImageIconVoice().addIconVoice("images/iconVoiceForResult.svg"));
      this.wrapperForWord.append(this.buttonSound, this.titleWord);
      this.wrapperForWord.classList.add("answer-content");
      return this.wrapperForWord;
    } else return this.wrapperForWord;
  }
}
export default WordResult;
