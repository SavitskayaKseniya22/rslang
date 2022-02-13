import { Word } from "../interfaces/interfaces";
import Button from "./button";

class Answer {
  addWrapperForAnswer(word: Word, number: number) {
    const wrapper = document.createElement("div");
    const numberAnswer = document.createElement("span");
    numberAnswer.innerHTML = (number + 1).toString();
    const button = new Button({
      className: `answer`,
      text: word.wordTranslate,
    });
    wrapper.classList.add("container-answer");
    numberAnswer.classList.add("number-span");
    button.element.classList.add("button-answer");
    wrapper.append(button.element, numberAnswer)
    return wrapper;
  }
}
export default Answer;
