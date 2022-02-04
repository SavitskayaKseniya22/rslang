import { Word } from "./type";

class WordResult {
  wrapperForWord = document.createElement("div");
  titleWord = document.createElement("h4");
  spanTranslateWord = document.createElement("span");
  addWrapperForWord(arrayTrueWords: Word[], count: number) {
    this.titleWord.innerHTML = arrayTrueWords[count].word;
    this.spanTranslateWord.innerHTML = ` - ${arrayTrueWords[count].wordTranslate}`;
    this.titleWord.append(this.spanTranslateWord);
    this.wrapperForWord.append(this.titleWord);
    return this.wrapperForWord;
  }
}
export default WordResult;
