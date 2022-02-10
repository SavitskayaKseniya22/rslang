import BasicQuestion from "./basicQuestion";
import ConrolGame from "./controlgame";
import ResultRaund from "./resultRaund";
import { Question, Word } from "./type";

class AudioGame {
  count: number;
  trueAnswer: string;
  arrayQuestions: Question[];
  arrayTrueWords: Word[];
  arrayNumberTrueAnswers: number[];
  arrayNumberFalseAnswers: number[];
  groupAgain: number;
  pageAgain: number;
  player = document.createElement("audio");
  constructor(data: Question[], arrayTrueWords: Word[], group: number, page: number) {
    this.groupAgain = group;
    this.pageAgain = page;
    this.arrayNumberTrueAnswers = [];
    this.arrayNumberFalseAnswers = [];
    this.arrayTrueWords = arrayTrueWords;
    // this.arrayTrueWords.forEach((item) => {
    //   console.log(item.wordTranslate);
    // });
    this.count = 0;
    this.arrayQuestions = data;
    this.startGame(this.arrayQuestions[0]);
  }
  startGame(data: Question) {
    new BasicQuestion().renderQuestion(data);
    this.addEventListenerForButtonAction();
    this.addEventListenerForWrapperAnswers();
    this.trueAnswer = data.truthyAnswer.wordTranslate;
    this.addSoundAnswer(`http://localhost:3000/${data.truthyAnswer.audio}`);
    this.addEventListenerForBigIconSound(`http://localhost:3000/${data.truthyAnswer.audio}`);
    this.addEventListenerForSmallIconSound(`http://localhost:3000/${data.truthyAnswer.audio}`);
  }
  addSoundAnswer(src: string) {
    this.player.setAttribute("src", src);
    this.player.play();
  }
  addEventListenerForWrapperAnswers() {
    const wrapperForAnswers = document.querySelector(".wrapper-answers");
    wrapperForAnswers.addEventListener("click", (event) => {
      if ((<HTMLElement>event.target).innerText === this.trueAnswer) {
        this.addSoundAnswer(`images/true-call.mp3`);
        this.arrayNumberTrueAnswers.push(this.count);
        this.addMarkTrueAnswer((<HTMLElement>event.target))
        this.addAnswer();
        this.addAtributeDisabled();
      } else if ((<HTMLElement>event.target).innerText !== this.trueAnswer) {
        this.addSoundAnswer(`images/false-call.mp3`);
        this.arrayNumberFalseAnswers.push(this.count);
        this.addMarkFalseAnswer((<HTMLElement>event.target))
        this.addAnswer();
        this.addAtributeDisabled();
      }
    });
  }
  addAtributeDisabled() {
    const buttonsAnswer = document.querySelectorAll(".answer");
    buttonsAnswer.forEach((item) => {
      item.setAttribute("disabled", "");
    })
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
  addEventListenerForButtonAction() {
    const buttonActive = document.querySelector(".button-active");
    buttonActive.addEventListener("click", () => {
      this.addAtributeDisabled();
      this.addAnswer();
      this.arrayNumberFalseAnswers.push(this.count);
    });
  }
  addEventListenerForButtonNext() {
    const buttonNext = document.querySelector(".button-next");
    buttonNext.addEventListener("click", () => {
      this.count++;
      if (this.count < 10) {
        this.startGame(this.arrayQuestions[this.count]);
      } else {
        new ResultRaund(this.arrayTrueWords, this.arrayNumberTrueAnswers, this.arrayNumberFalseAnswers);
        this.addEventListenerForResultWrapper();
        this.addEventListenerForButtonPlayAgain();
      }

    })
  }
  addEventListenerForBigIconSound(src: string) {
    const voiceIcon = document.querySelector(".voice-icon");
    voiceIcon.addEventListener("click", () => {
      this.addSoundAnswer(src);
    });
  }
  addEventListenerForSmallIconSound(src: string) {
    const voiceIcon = document.querySelector(".voice-icon-small");
    voiceIcon.addEventListener("click", () => {
      this.addSoundAnswer(src);
    });
  }
  addEventListenerForResultWrapper() {
    const resultWrapper = document.querySelectorAll(".voice-icon-result");
    resultWrapper.forEach((item) => {
      item.addEventListener("click", () => {
        this.addSoundAnswer(`http://localhost:3000/${item.id}`);
      })
    });
  }
  addEventListenerForButtonPlayAgain() {
    const button = document.querySelector(".button-play-again");
    button.addEventListener("click", () => {
      new ConrolGame(this.groupAgain, this.pageAgain);
    });
  }

}
export default AudioGame; 