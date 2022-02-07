import AudioGame from "./audioGame";
import { Question, Word } from "./type";

class ConrolGame {
  arrayTrueWords: Word[];
  arrayFalseWords: Word[];
  arrayQuestions: Question[];
  constructor(dataTrue: Word[], dataFalse: Word[], dataFalseTwo: Word[], group: number, page: number) {
    this.getArrayTrueWords(dataTrue);
    this.arrayFalseWords = dataFalse.concat(dataFalseTwo);
    this.getQuestions(this.arrayTrueWords, this.arrayFalseWords);
    new AudioGame(this.arrayQuestions, this.arrayTrueWords, group, page);
  }
  randomInteger(min, max) {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }
  getArrayTrueWords(data: Word[]) {
    const maxNumber = this.randomInteger(0, 1);
    if (maxNumber === 0) {
      this.arrayTrueWords = data.slice(0, 10);
    } else if (maxNumber === 1) {
      this.arrayTrueWords = data.slice(9, 19);
    }
  }
  getQuestions(dataTrue: Word[], dataFalse: Word[]) {
    function colSplit(arr, c) {
      const res = new Array(c);
      for (let i = 0; i < c; ++i) {
        res[i] = [];
      }
      for (let i = 0; i < arr.length; ++i) {
        res[i % c].push(arr[i]);
      }
      return res;
    }
    const newArr = colSplit(dataFalse, 10).map((elem, i, arr) => {
      return { [`true`]: dataTrue[i], [`false`]: arr[i] }
    })
    this.arrayQuestions = newArr;
  }
}
export default ConrolGame;
