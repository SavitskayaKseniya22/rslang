import ImageIconVoice from "./imageIconVoice";
import { Question, Word } from "./type";
import Button from "./button";

class BasicQuestion {
  mainWrapper = document.createElement("div");
  wrapperForIconVoice = document.createElement("button");
  wrapperForAnswers = document.createElement("div");
  wrapperForButton = document.createElement("div");
  wrapperForAnswersSmall = document.createElement("button");
  wrapperForAnswer = document.createElement("div");
  wrapperForAnswerContent = document.createElement("div");
  wordAnswer = document.createElement("h3");
  button: Button;

  renderQuestion(question: Question) {
    const arrayAnswers = [question.true].concat(question.false);
    document.querySelector('.main').innerHTML = "";
    this.mainWrapper.classList.add("question");
    this.mainWrapper.append(this.addIconVoice(), this.addWrapperForAnswer(question.true.image, question.true.word), this.addAnswers(arrayAnswers), this.addButtonAction());
    document.querySelector('.main').append(this.mainWrapper);
  }
  addIconVoice() {
    this.wrapperForIconVoice.append(new ImageIconVoice().addIconVoice("images/iconVoice.svg"));
    this.wrapperForIconVoice.classList.add("voice-icon");
    return this.wrapperForIconVoice;
  }
  addWrapperForAnswer(pathToImage: string, word: string) {
    this.wordAnswer.innerHTML = word;
    this.wrapperForAnswersSmall.classList.add("voice-icon-small");
    this.wrapperForAnswersSmall.append(new ImageIconVoice().addIconVoice("images/iconVoiceSmall.svg"));
    this.wrapperForAnswerContent.classList.add("answer-content");
    this.wrapperForAnswerContent.append(this.wrapperForAnswersSmall, this.wordAnswer);
    this.wrapperForAnswer.classList.add("question", "wrapper-answer");
    this.wrapperForAnswer.append(new ImageIconVoice().addIconVoice(`http://localhost:3000/${pathToImage}`), this.wrapperForAnswerContent);
    return this.wrapperForAnswer;
  }
  addAnswers(arrayAnswers: Word[]) {
    const sortArrQuestions = this.shuffle([1, 2, 3, 4, 5].map((item, i) => arrayAnswers[i]));
    this.wrapperForAnswers.innerHTML = "";
    this.wrapperForAnswers.classList.add("wrapper-answers");
    sortArrQuestions.forEach((item) => {
      const button = new Button({
        className: `answer`,
        text: item.wordTranslate,
      });
      this.wrapperForAnswers.append(button.element);
    });
    return this.wrapperForAnswers;
  }
  addButtonAction() {
    const buttonActive = new Button({
      className: "button-active",
      text: "I don't know",
    });
    const buttonNext = new Button({
      className: "button-next",
      text: "Next word",
    });
    this.wrapperForButton.append(buttonActive.element, buttonNext.element);
    return this.wrapperForButton;
  }
  shuffle(arr) {
    let j, temp;
    for (let i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }
    return arr;
  }
}
export default BasicQuestion;
