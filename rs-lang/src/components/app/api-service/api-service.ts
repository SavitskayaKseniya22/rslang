import ConrolGame from "../audioCallGame/controlgame";
import { Word } from "../audioCallGame/type";


class ApiService {
  async getWords(group = 0) {
    function randomInteger(min, max) {
      const rand = min + Math.random() * (max + 1 - min);
      return Math.floor(rand);
    }
    let page = randomInteger(0, 29);
    await fetch(`http://localhost:3000/words?page=${page}&group=${group}`)
      .then((resp) => resp.json())
      .then((dataTrue: Word[]) => {
        if (group >= 0 && group !== 6) {
          group += 1;
        } else if (group === 6) {
          group -= 1;
        }
        if (page >= 0 && page !== 29) {
          page += 1;
        } else if (page === 29) {
          page -= 1;
        }
        fetch(`http://localhost:3000/words?page=${page}&group=${group}`)
          .then((resp) => resp.json())
          .then((dataFalse: Word[]) => {
            if (group >= 0 && group !== 6) {
              group += 1;
            } else if (group === 6) {
              group -= 1;
            }
            if (page >= 0 && page !== 29) {
              page += 1;
            } else if (page === 29) {
              page -= 1;
            }
            fetch(`http://localhost:3000/words?page=${page}&group=${group}`)
              .then((resp) => resp.json())
              .then((dataFalseTwo: Word[]) => {
                new ConrolGame(dataTrue, dataFalse, dataFalseTwo);
              });
          });
      });
  }
}
export default ApiService
