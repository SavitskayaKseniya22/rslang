class ApiService {
  async getWords(lvl: number, pageNum: number) {
    const rawResponse = await fetch(
      `https://react-learnwords-example.herokuapp.com/words?group=${lvl}&page=${pageNum}`,
      {
        method: 'GET',
      }
    )
    const content = await rawResponse.json()

    return content
  }
}

export default ApiService
