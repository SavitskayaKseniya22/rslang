class ApiService {
  async getAudioWords(group: number, page: number) {
    const response = await fetch(`http://localhost:3000/words?page=${page}&group=${group}`);
    const exam = await response.json();
    return exam;
  }
}
export default ApiService
