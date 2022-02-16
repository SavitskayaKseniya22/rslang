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
      console.log(this.user)
    }
    this.apiService = new ApiService(this.user)
    this.authorization = new Authorization(this.apiService)
    this.mainPage = new MainPage()
    this.textBook = new TextBookPage(this.apiService)
    this.navMenu = new NavMenu(this.apiService, this.mainPage, this.textBook)
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
      this.authorization.renderLoggedIn(this.user.name)
    } else {
      this.authorization.addListener()
    }
  }
}
export default App
