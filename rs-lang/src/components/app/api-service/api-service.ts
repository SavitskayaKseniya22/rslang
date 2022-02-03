class ApiService {
  apiUrl: string
  constructor() {
    this.apiUrl = `http://127.0.0.1:3000`
  }
  async requestWords(grp: number, page: number) {
    const res = await fetch(`${this.apiUrl}/words?page=${page}&group=${grp}`)
    if (res.ok){
        const words = await res.json()
        return words
    }
  }
}
export default ApiService
