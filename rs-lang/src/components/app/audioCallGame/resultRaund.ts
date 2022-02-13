import ApiService from "../api-service/api-service";
import { UserTemplate, Word } from "../interfaces/interfaces";
import Button from "./button";
import WordResult from "./wordResult";

class ResultRaund {
  arrayTrueWords: Word[];
  arrayNumberTrueAnswers: number[];
  arrayNumberFalseAnswers: number[];
  user: UserTemplate;
  apiServiceUser: ApiService;
  constructor(arrayTrueWords: Word[], arrayNumberTrueAnswers: number[], arrayNumberFalseAnswers: number[], arrayCountInRow: number[]) {
    console.log(arrayCountInRow);
    this.user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    this.apiServiceUser = new ApiService(this.user);
    this.arrayTrueWords = arrayTrueWords;
    this.arrayNumberTrueAnswers = arrayNumberTrueAnswers;
    this.arrayNumberFalseAnswers = arrayNumberFalseAnswers;
    document.querySelector('.main').innerHTML = "";
    document.querySelector('.main').append(this.addWrapperResult(arrayNumberTrueAnswers, arrayNumberFalseAnswers));
    if (this.user !== null) this.requestResultRaund();
  }
  requestResultRaund() {
    this.arrayTrueWords.forEach((word, i, words) => {
      if (word.userWord === undefined) {
        this.apiServiceUser.requestAddUserWord(this.apiServiceUser.user.userId, word._id, { difficulty: "normal", optional: { timesGuessed: 0, timesMax: 3 } });
      } else {
        if (this.arrayNumberTrueAnswers.includes(i)) {
          this.requestUpdateUserWordForTrueAnswer(words, i);
        } else if (this.arrayNumberFalseAnswers.includes(i)) {
          this.requestUpdateUserWordForFalseAnswer(words, i);
        }
      }
    });
  }
  async requestUpdateUserWordForTrueAnswer(words: Word[], i: number) {
    const trueAnswer = await this.apiServiceUser.requestGetUserWord(this.apiServiceUser.user.userId, words[i]._id);
    if (trueAnswer.difficulty === "difficult" || trueAnswer.difficulty === "normal") {
      const timesMax = trueAnswer.optional.timesGuessed;
      let timesGuessed = trueAnswer.optional.timesGuessed;
      timesGuessed++;
      if (timesGuessed >= timesMax) {
        this.apiServiceUser.requestUpdateUserWord(this.apiServiceUser.user.userId, words[i]._id, { difficulty: "learned", optional: { timesGuessed: timesGuessed, timesMax: 3 } });
      }
    } else if (trueAnswer.difficulty === "learned") {
      const timesMax = trueAnswer.optional.timesGuessed;
      const timesGuessed = trueAnswer.optional.timesGuessed;
      if (timesGuessed < timesMax) {
        this.apiServiceUser.requestUpdateUserWord(this.apiServiceUser.user.userId, words[i]._id, { difficulty: "learned", optional: { timesGuessed: timesGuessed, timesMax: 3 } });
      }
    }
  }
  async requestUpdateUserWordForFalseAnswer(words: Word[], i: number) {
    const falseAnswer = await this.apiServiceUser.requestGetUserWord(this.apiServiceUser.user.userId, words[i]._id);
    if (falseAnswer.difficulty === "difficult" || falseAnswer.difficulty === "normal") {
      const difficulty = falseAnswer.difficulty;
      this.apiServiceUser.requestUpdateUserWord(this.apiServiceUser.user.userId, words[i]._id, { difficulty: difficulty, optional: { timesGuessed: 0, timesMax: 3 } });
    } else if (falseAnswer.difficulty === "learned") {
      this.apiServiceUser.requestUpdateUserWord(this.apiServiceUser.user.userId, words[i]._id, { difficulty: "normal", optional: { timesGuessed: 0, timesMax: 3 } });
    }

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
