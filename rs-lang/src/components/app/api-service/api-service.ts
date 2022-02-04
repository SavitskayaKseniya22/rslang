import { FormInfo, UserTemplate } from '../interfaces/interfaces'

class ApiService {
  apiUrl: string
  user: UserTemplate | null
  constructor(user: UserTemplate | null) {
    this.user = user
    this.apiUrl = `http://127.0.0.1:3000`
  }
  async requestWords(grp: number, page: number) {
    const res = await fetch(`${this.apiUrl}/words?page=${page}&group=${grp}`)
    if (res.ok) {
      const words = await res.json()
      return words
    }
  }
  async requestRegistration(formData: FormInfo) {
    console.log(formData)

    const res = await fetch(`${this.apiUrl}/users`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      console.log('ok')
      const content = await res.json()
      return content
  }

  async requestLogIn(formData: FormInfo) {
    console.log(formData)
    const res = await fetch(`${this.apiUrl}/signin`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    if(res.ok){
    const content = await res.json()
    return content
    } else {
      throw new Error('incorrect email or password')
    }
  }
  async requestDeleteUser(id: string) {
    const res = await fetch(`${this.apiUrl}/users`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    
    const content = await res.json()
    return content
  }
}
export default ApiService
