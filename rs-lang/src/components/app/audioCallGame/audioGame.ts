import BasicQuestion from "./basicQuestion";
import ResultRaund from "./resultRaund";
import { Question, Word } from "./type";

class AudioGame {
  count: number;
  trueAnswer: string;
  arrayQuestions: Question[];
  arrayTrueWords: Word[];
  arrayNumberTrueAnswers: number[];
  arrayNumberFalseAnswers: number[]
  constructor(data: Question[], arrayTrueWords: Word[]) {
    this.arrayNumberTrueAnswers = [];
    this.arrayNumberFalseAnswers = [];
    this.arrayTrueWords = arrayTrueWords;
    this.arrayTrueWords.forEach((item) => {
      console.log(item.wordTranslate);
    });
    this.count = 0;
    this.arrayQuestions = data;
    this.startGame(this.arrayQuestions[0]);
  }
  startGame(data: Question) {
    new BasicQuestion().renderQuestion(data);
    this.addEventListenerForButtonAction();
    this.addEventListenerForWrapperAnswers();
    this.trueAnswer = data.true.wordTranslate;
  }
  addEventListenerForButtonAction() {
    const buttonActive = document.querySelector(".button-active");
    buttonActive.addEventListener("click", () => {
      this.addAnswer();
    });
  }
  addEventListenerForWrapperAnswers() {
    const wrapperForAnswers = document.querySelector(".wrapper-answers");
    wrapperForAnswers.addEventListener("click", (event) => {
      if ((<HTMLElement>event.target).innerText === this.trueAnswer) {
        this.arrayNumberTrueAnswers.push(this.count);
        this.addMarkTrueAnswer((<HTMLElement>event.target))
        this.addAnswer();
      } else if ((<HTMLElement>event.target).innerText !== this.trueAnswer) {
        this.arrayNumberFalseAnswers.push(this.count);
        this.addMarkFalseAnswer((<HTMLElement>event.target))
        this.addAnswer();
      }
    });
  }
  addAnswer() {
    const wrapperAnswer = document.querySelector(".wrapper-answer");
    const voiceIcon = document.querySelector(".voice-icon");
    const buttonActive = document.querySelector(".button-active");
    const buttonNext = document.querySelector(".button-next");
    wrapperAnswer.classList.add("flex");
    voiceIcon.classList.add("none");
    buttonActive.classList.add("none");
    buttonNext.classList.add("initial");
    this.addEventListenerForButtonNext();
  }
  addMarkFalseAnswer(element: HTMLElement) {
    element.style.backgroundColor = "red";
  }
  addMarkTrueAnswer(element: HTMLElement) {
    element.style.backgroundColor = "green";
  }
  addEventListenerForButtonNext() {
    const buttonNext = document.querySelector(".button-next");
    buttonNext.addEventListener("click", () => {
      this.count++;
      if (this.count < 10) {
        this.startGame(this.arrayQuestions[this.count])
      } else new ResultRaund(this.arrayTrueWords, this.arrayNumberTrueAnswers, this.arrayNumberFalseAnswers);
    })
  }


}
export default AudioGame; 