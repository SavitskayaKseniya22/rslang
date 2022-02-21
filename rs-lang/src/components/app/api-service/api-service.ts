import { FormInfo, statObj, UserTemplate, UserWordInfo } from '../interfaces/interfaces'

class ApiService {
  url: string
  apiUrl: string
  constructor(public user: UserTemplate | null) {
    this.user = user
    this.apiUrl = `http://localhost:3000`
  }

  async requestWords(grp: number, page: number) {
    const res = await fetch(`${this.apiUrl}/words?page=${page}&group=${grp}`)
    if (res.ok) {
      const words = await res.json()
      return words
    } else {
      throw new Error(` error: ${res.status}, check your connection to the server`)
    }
  }

  async requestRegistration(formData: FormInfo) {
    const res = await fetch(`${this.apiUrl}/users`, {
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
    } else if (res.status === 417) {
      throw new Error(` error: ${res.status}, user with this adress already exists`)
    } else {
      throw new Error(`${res.statusText}`)
    }
  }

  async requestLogIn(formData: FormInfo) {
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
    } else if (res.status === 403) {
      throw new Error('incorrect email or password')
    } else if (res.status === 404) {
      throw new Error('Such user does not exist')
    } else {
      throw new Error(`${res.statusText}`)
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
    if (!res.ok) {
      throw new Error(`${res.status}`)
    }
  }

  async requestDeleteUserWord(userId: string, wordId: string) {
    const res = await fetch(`${this.apiUrl}/users/${userId}/words/${wordId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    if (res.ok) {
      return
    } else {
      throw new Error(` error: ${res.status}, please repeat the log-in procedure`)
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
      throw new Error(`error: ${res.status}, please repeat the log-in procedure`)
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
      throw new Error(`error: ${res.status}, either word does not exist or a repeated log-in procedure is required`)
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
      throw new Error(`error: ${res.status}, either word does not exist or a repeated log-in procedure is required`)
    }
  }
  async requestGetUserAgregatedPageGrp(userId: string, group: string, page: string, wordsPerPage: string) {
    const query = `${this.apiUrl}/users/${userId}/aggregatedWords?wordsPerPage=${wordsPerPage}&filter={"$and":[{"page":${page}}, {"group":${group}}]}`
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
      return content[0].paginatedResults
    } else {
      throw new Error(`error: ${res.status}, check your connection or repeat the log-in procedure`)
    }
  }

  async requestGetAggregatedFIlter(userId: string, filter: string) {
    const res = await fetch(`${this.apiUrl}/users/${userId}/aggregatedWords?wordsPerPage=20&filter=${filter}`, {
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
      throw new Error(`error: ${res.status}, check your connection or repeat the log-in procedure`)
    }
  }

  async requestUpdateToken(id: string) {
    const res = await fetch(`${this.apiUrl}/users/${id}/tokens`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.refreshToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    if (res.ok) {
      const content = await res.json()
      return content
    } else {
      throw new Error(`error user no longer exists`)
    }
  }

  async updateToken() {
    try {
      const tokens = await this.requestUpdateToken(this.user.userId)
      this.user.token = tokens.token
      this.user.refreshToken = tokens.refreshToken
      localStorage.setItem('user', JSON.stringify(this.user))
      window.location.reload()
    } catch (err) {
      this.user = null
      localStorage.removeItem('user')
      window.location.reload()
    }
  }
  async getUser() {
    const res = await fetch(`${this.apiUrl}/users/${this.user.userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    if (res.ok) {
      const user = await res.json()
      return user
    } else {
      throw new Error(`${res.status}`)
    }
  }

  async getWords(lvl: number, pageNum: number) {
    const rawResponse = await fetch(`${this.apiUrl}/words?group=${lvl}&page=${pageNum}`, {
      method: 'GET',
    })
    const content = await rawResponse.json()

    return content
  }

  async getAggregatedWords(id: string, lvl: number, pageNum: number) {
    const rawResponse = await fetch(`${this.apiUrl}/users/${id}/aggregatedWords?group=${lvl}&page=${pageNum}`, {
      method: 'GET',
    })
    if (!rawResponse.ok) {
      throw new Error(`${rawResponse.status}`)
    } else {
      const content = await rawResponse.json()
      return content
    }
  }

  async getAudioWords(group: number, page: number) {
    const response = await fetch(`${this.apiUrl}/words?page=${page}&group=${group}`)
    const exam = await response.json()
    return exam
  }

  async requestUpdStatistics(userId: string, statistics: statObj) {
    const res = await fetch(`${this.apiUrl}/users/${userId}/statistics`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statistics),
    })
    if (!res.ok) {
      throw new Error(`${res.status} Can not update statistics`)
    }
  }
  async getUserStatistics(userId: string) {
    const rawResponse = await fetch(`${this.apiUrl}/users/${userId}/statistics`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    if (!rawResponse.ok) {
      throw new Error(`${rawResponse.status}`)
    } else {
      const content = await rawResponse.json()
      return content
    }
  }
}

export default ApiService
