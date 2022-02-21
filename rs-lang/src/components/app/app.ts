import ApiService from './api-service/api-service'
import Authorization from './core/authorization/authorization'
import MainPage from './core/main-page/main-page'
import TextBookPage from './core/text-book-page/text-book-page'
import { UserTemplate } from './interfaces/interfaces'
import NavMenu from './nav-menu/nav-menu'

class App {
  navMenu: NavMenu
  apiService: ApiService
  mainPage: MainPage
  textBook: TextBookPage
  authorization: Authorization
  user: UserTemplate | null
  constructor() {
    this.user = null
    if (localStorage.getItem('user')) {
      const usr = JSON.parse(localStorage.getItem('user'))
      this.user = usr === undefined ? null : usr
    }
    this.apiService = new ApiService(this.user)
    this.authorization = new Authorization(this.apiService)
    this.mainPage = new MainPage()
    this.textBook = new TextBookPage(this.apiService)
    this.navMenu = new NavMenu(this.apiService, this.mainPage, this.textBook)
    if (this.user !== null) {
      this.resetStat()
    }
  }
  async resetStat() {
    try {
      const userStatistics = await this.apiService.getUserStatistics(this.apiService.user.userId)
      if (
        userStatistics.optional.dateStr !==
        `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
      )
        this.requestResetStat()
    } catch (error) {
      this.requestResetStat()
    }
  }
  requestResetStat() {
    try {
      this.apiService.requestUpdStatistics(this.apiService.user.userId, {
        learnedWords: 0,
        optional: {
          sprintStat: {
            streak: 0,
            percent: 0,
            newWords: 0,
            played: false,
          },
          audioStat: {
            countNewWord: 0,
            percentTrueAnswer: 0,
            inRow: 0,
            played: false,
          },
          dateStr: `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`,
        },
      })
    } catch (err) {
      this.apiService.updateToken()
    }
  }
  async run(): Promise<void> {
    document.querySelector('.body').innerHTML = `
      <div class="auth-overlay hidden">
      <div class="auth-form auth-log-in-form hidden"></div>
      <div class="auth-form auth-register-form hidden"></div>
      </div>
      <aside class="navbar"></aside>
      <div class="app">
      <header class="header">
      <div class="header-log-in-status"><i class="fa-solid fa-arrow-right-to-bracket"></i></div>
      </header>
      <main class="main"></main>
      <footer class="footer">
      <div class="footer-course-logo">
      <a href="https://rs.school/js/" target="_blank">
      <img src="./images/rs_school_js.svg" alt="link" width="100"/>
      </a>
      </div>
      <div class="footer-git-links">
           <a class="footer-git-link" href="https://github.com/SavitskayaKseniya22" target="_blank"> Kseniya Savitskaya </a>
           <a class="footer-git-link" href="https://github.com/Nikita1814" target="_blank"> Nikita Kravchenko </a>
           <a class="footer-git-link" href="https://github.com/Yauheny-Bychkou" target="_blank"> Yauheny Bychkou </a>
      </div>
      <p class="footer-copyright">&#169; 2022</p>
      </footer>
      </div>
      `
    this.navMenu.render()
    this.mainPage.render()
    window.location.hash = 'main'
    if (this.user) {
      try {
        await this.apiService.getUser()
        this.authorization.renderLoggedIn(this.user.name)
      } catch (err) {
        const error = err as Error
        if (error.message.includes('401')) {
          await this.apiService.updateToken()
        } else if (error.message.includes('404')) {
          console.log('sorry such user no longer exists')
          this.user = null
          localStorage.removeItem('user')
          window.location.reload()
        } else {
          await this.apiService.updateToken()
        }
      }
    } else {
      this.authorization.addListener()
    }
  }
}
export default App
