import { Word } from "./type";
import WordResult from "./wordResult";

class ResultRaund {
  wrapperResult = document.createElement("div");

  wrapperTrueResult = document.createElement("div");
  titleWrapperTrueResult = document.createElement("h3");
  spanWrapperTrueResult = document.createElement("span");

  wrapperFalseResult = document.createElement("div");
  titleWrapperFalseResult = document.createElement("h3");
  spanWrapperFalseResult = document.createElement("h3");
  arrayTrueWords: Word[];
  constructor(arrayTrueWords: Word[], arrayNumberTrueAnswers: number[], arrayNumberFalseAnswers: number[]) {
    this.arrayTrueWords = arrayTrueWords;
    document.querySelector('.main').innerHTML = "";
    document.querySelector('.main').append(this.addWrapperResult(arrayNumberTrueAnswers, arrayNumberFalseAnswers));
  }
  addWrapperResult(arrayNumberTrueAnswers: number[], arrayNumberFalseAnswers: number[]) {
    this.wrapperResult.append(this.addWrapperTrueResult(arrayNumberTrueAnswers), this.addWrapperFalseResult(arrayNumberFalseAnswers));
    return this.wrapperResult;
  }
  addWrapperTrueResult(arrayNumberTrueAnswers: number[]) {
    this.titleWrapperTrueResult.innerHTML = "Знаю";
    this.spanWrapperTrueResult.innerHTML = ` ${arrayNumberTrueAnswers.length.toString()}`;
    this.titleWrapperTrueResult.append(this.spanWrapperTrueResult);
    this.wrapperTrueResult.prepend(this.titleWrapperTrueResult);
    arrayNumberTrueAnswers.forEach((item) => this.wrapperTrueResult.append(new WordResult().addWrapperForWord(this.arrayTrueWords, item)));
    return this.wrapperTrueResult;
  }
  addWrapperFalseResult(arrayNumberFalseAnswers: number[]) {
    this.titleWrapperFalseResult.innerHTML = "Не Знаю";
    this.spanWrapperFalseResult.innerHTML = ` ${arrayNumberFalseAnswers.length.toString()}`;
    this.titleWrapperFalseResult.append(this.spanWrapperFalseResult);
    this.wrapperFalseResult.prepend(this.titleWrapperFalseResult);
    arrayNumberFalseAnswers.forEach((item) => this.wrapperFalseResult.append(new WordResult().addWrapperForWord(this.arrayTrueWords, item)))
    return this.wrapperFalseResult;
  }
}
export default ResultRaund;
