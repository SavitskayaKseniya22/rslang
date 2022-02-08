import ConrolGame from "../audioCallGame/controlgame";
import { Word } from "../audioCallGame/type";


class ApiService {
  async getWords(group: number, page = -1) {
    function randomInteger(min, max) {
      const rand = min + Math.random() * (max + 1 - min);
      return Math.floor(rand);
    }
    page = page !== -1 ? page : randomInteger(0, 29);
    const groupAgain = group;
    const pageAgain = page;
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
                new ConrolGame(dataTrue, dataFalse, dataFalseTwo, groupAgain, pageAgain);
              });
          });
      });
  }
}
export default ApiService
