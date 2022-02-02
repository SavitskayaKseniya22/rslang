import ApiService from './api-service/api-service'
import MainPage from './core/main-page/main-page'
import NavMenu from './nav-menu/nav-menu'

class App {
  navMenu: NavMenu
  service: ApiService
  mainPage: MainPage
  constructor() {
    this.service = new ApiService()
    this.navMenu = new NavMenu(this.service, this.mainPage)
    this.mainPage = new MainPage()
  }
  run(): void {
    document.querySelector('.body').innerHTML = `
      <aside class="navbar"></aside>
      <div class="app">
      <header class="header">
      <h1 class ="header-page-title"> Main Page</h1>
      <div class="header-log-in-status">Log in</div>
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
  }
}
export default App
