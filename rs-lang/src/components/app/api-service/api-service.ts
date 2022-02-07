class ApiService {
  url: string
  constructor() {
    this.url = 'https://react-learnwords-example.herokuapp.com'
  }

  async getWords(lvl: number, pageNum: number) {
    const rawResponse = await fetch(`${this.url}/words?group=${lvl}&page=${pageNum}`, {
      method: 'GET',
    })
    const content = await rawResponse.json()

    return content
  }

  async getAggregatedWords(id: number, lvl: number, pageNum: number) {
    const rawResponse = await fetch(`${this.url}/users/${id}/aggregatedWords?group=${lvl}&page=${pageNum}`, {
      method: 'GET',
    })
    const content = await rawResponse.json()

    return content
  }
}

export default ApiService
