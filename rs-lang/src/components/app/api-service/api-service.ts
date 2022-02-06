import { FormInfo, UserTemplate, UserWordInfo } from '../interfaces/interfaces'

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
    if (res.ok) {
      const content = await res.json()
      return content
    } else {
      throw new Error('incorrect email or password')
    }
  }
  async requestDeleteUser(id: string) {
    const res = await fetch(`${this.apiUrl}/users`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    const content = await res.json()
    return content
  }
  async requestAddUserWord(userId: string, wordId: string, word: UserWordInfo) {
    const res = await fetch(`${this.apiUrl}/users/${userId}/words/${wordId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(word),
    })
    if (res.ok) {
      console.log('ok')
    } else {
      throw new Error(`${res.status}`)
    }
  }

  async requestDeleteUserWord(userId: string, wordId: string, word: UserWordInfo) {
    const res = await fetch(`${this.apiUrl}/users/${userId}/words/${wordId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(word),
    })
    if (res.ok) {
      return
    } else {
      throw new Error('something went wrong')
    }
  }

  async requestGetUserWords(userId: string) {
    const res = await fetch(`${this.apiUrl}/users/${userId}/words/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    if (res.ok) {
      const content = await res.json()
      return content
    } else {
      throw new Error('something went wrong')
    }
  }
  async requestUpdateUserWord(userId: string, wordId: string, word: UserWordInfo) {
    const res = await fetch(`${this.apiUrl}/users/${userId}/words/${wordId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(word),
    })
    if (res.ok) {
      return
    } else {
      throw new Error('something went wrong')
    }
  }

  async requestGetUserWord(userId: string, wordId: string) {
    const res = await fetch(`${this.apiUrl}/users/${userId}/words/${wordId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    if (res.ok) {
      const content = await res.json()
      return content
    } else {
      throw new Error('something went wrong')
    }
  }
  async requestGetUserAgregatedPageGrp(
    userId: string,
    group: string,
    page: string,
    wordsPerPage: string,
    filter?: string
  ) {
    let query = `${this.apiUrl}/users/${userId}/aggregatedWords?page=${page}&group=${group}&wordsPerPage=${wordsPerPage}`
    if (filter) {
      query += `&filter=${filter}`
    }
    const res = await fetch(query, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    if (res.ok) {
      const content = await res.json()
      console.log(content)
      return content[0].paginatedResults
    } else {
      throw new Error('something went wrong')
    }
  }
  async requestGetAggregatedFIlter(userId: string, filter: string) {
    const res = await fetch(`${this.apiUrl}/users/${userId}/aggregatedWords?filter=${filter}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    if (res.ok) {
      const content = await res.json()
      return content[0].paginatedResults
    } else {
      throw new Error('something went wrong')
    }
  }
}
export default ApiService
