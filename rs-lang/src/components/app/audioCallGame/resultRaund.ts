import Button from "./button";
import { Word } from "./type";
import WordResult from "./wordResult";

class ResultRaund {
  arrayTrueWords: Word[];
  constructor(arrayTrueWords: Word[], arrayNumberTrueAnswers: number[], arrayNumberFalseAnswers: number[]) {
    this.arrayTrueWords = arrayTrueWords;
    document.querySelector('.main').innerHTML = "";
    document.querySelector('.main').append(this.addWrapperResult(arrayNumberTrueAnswers, arrayNumberFalseAnswers));
  }
  addWrapperResult(arrayNumberTrueAnswers: number[], arrayNumberFalseAnswers: number[]) {
    const wrapperResult = document.createElement("div");
    const buttonAgain = new Button({
      className: "button-play-again",
      text: "Play again",
    });
    wrapperResult.append(this.addWrapperTrueResult(arrayNumberTrueAnswers), this.addWrapperFalseResult(arrayNumberFalseAnswers), buttonAgain.element);
    wrapperResult.classList.add("result-wrapper");
    return wrapperResult;
  }
  addWrapperTrueResult(arrayNumberTrueAnswers: number[]) {
    const wrapperTrueResult = document.createElement("div");
    const titleWrapperTrueResult = document.createElement("h3");
    const spanWrapperTrueResult = document.createElement("span");
    titleWrapperTrueResult.innerHTML = "Correct Answers";
    spanWrapperTrueResult.innerHTML = ` ${arrayNumberTrueAnswers.length.toString()}`;
    titleWrapperTrueResult.append(spanWrapperTrueResult);
    wrapperTrueResult.prepend(titleWrapperTrueResult);
    arrayNumberTrueAnswers.forEach((item) => wrapperTrueResult.append(new WordResult().addWrapperForWord(this.arrayTrueWords, item)));
    return wrapperTrueResult;
  }
  addWrapperFalseResult(arrayNumberFalseAnswers: number[]) {
    const wrapperFalseResult = document.createElement("div");
    const titleWrapperFalseResult = document.createElement("h3");
    const spanWrapperFalseResult = document.createElement("span");
    titleWrapperFalseResult.innerHTML = "Mistakes";
    spanWrapperFalseResult.innerHTML = ` ${arrayNumberFalseAnswers.length.toString()}`;
    titleWrapperFalseResult.append(spanWrapperFalseResult);
    wrapperFalseResult.prepend(titleWrapperFalseResult);
    arrayNumberFalseAnswers.forEach((item) => wrapperFalseResult.append(new WordResult().addWrapperForWord(this.arrayTrueWords, item)))
    return wrapperFalseResult;
  }
}
export default ResultRaund;
