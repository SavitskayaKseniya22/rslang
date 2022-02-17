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
      this.user = JSON.parse(localStorage.getItem('user'))

    }
    this.apiService = new ApiService(this.user)
    this.authorization = new Authorization(this.apiService)
    this.mainPage = new MainPage()
    this.textBook = new TextBookPage(this.apiService)
    this.navMenu = new NavMenu(this.apiService, this.mainPage, this.textBook)
    if (this.user !== null) {
      this.resetStat();
    }
  }
  async resetStat() {
    try {
      const userStatistics = await this.apiService.getUserStatistics(this.apiService.user.userId);
      if (userStatistics.optional.dateStr !== `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`) this.requestResetStat();
    } catch (error) {
      this.requestResetStat();
    }
  }
  requestResetStat() {
    this.apiService.requestUpdStatistics(
      this.apiService.user.userId,
      {
        learnedWords: 0,
        optional: {
          sprintStat: {
            streak: 0,
            percent: 0,
            newWords: 0,
          },
          audioStat: {
            countNewWord: 0,
            percentTrueAnswer: 0,
            inRow: 0,
          },
          dateStr: `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
        }
      }
    );
  }
  run(): void {
    document.querySelector('.body').innerHTML = `
      <div class="auth-overlay hidden">
      <div class="auth-form auth-log-in-form hidden"></div>
      <div class="auth-form auth-register-form hidden"></div>
      </div>
      <aside class="navbar"></aside>
      <div class="app">
      <header class="header">
      <h1 class ="header-page-title"> Main Page</h1>
      <div class="header-log-in-status"><i class="fas fa-unlock-alt lock-icon"></i>Log in</div>
      </header>
      <main class="main"></main>
      <footer class="footer">
      <div class="footer-course-logo"></div>
      <div class="footer-git-links">
          <a class="footer-git-link" href="blank">SavitskayaKseniya22</a>
          <a class="footer-git-link" href="blank">Nikita1814</a>
          <a class="footer-git-link" href="blank">Yauheny-Bychkou</a>
      </div>
      <p class="footer-copyright">© 2022</p>
      </footer>
      </div>
      `
    this.navMenu.render()
    this.mainPage.render()
    window.location.hash = 'main'
    if (this.user) {
      this.authorization.renderLoggedIn(this.user.name)
    } else {
      this.authorization.addListener()
    }
  }
}
export default App
