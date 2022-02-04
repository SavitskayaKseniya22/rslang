import { FormInfo } from "../interfaces/interfaces"

class ApiService {
  apiUrl: string
  constructor() {
    this.apiUrl = `http://127.0.0.1:3000`
  }
  async requestWords(grp: number, page: number) {
    const res = await fetch(`${this.apiUrl}/words?page=${page}&group=${grp}`)
    if (res.ok) {
      const words = await res.json()
      return words
    }
  }
  async requestRegistration(formData:FormInfo){
    console.log(formData)

    const res = await fetch(`${this.apiUrl}/users`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const content = await res.json();
    return content
  }

  async requestLogIn(formData: FormInfo){
    console.log(formData)
    const res = await fetch(`${this.apiUrl}/signin`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const content = await res.json();
    return content
  }
  async requestDeleteUser(id:string){
    const res = await fetch(`${this.apiUrl}/users`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
    const content = await res.json();
    return content
  }
}
export default ApiService
