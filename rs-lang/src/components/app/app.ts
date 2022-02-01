import ApiService from './api-service/api-service'
import NavMenu from './nav-menu/nav-menu'

class App {
  navMenu: NavMenu
  service: ApiService
  constructor() {
    this.service = new ApiService()
    this.navMenu = new NavMenu(this.service)
  }
  run(): void {
    document.querySelector('.body').innerHTML = `
      <aside class="navbar"></aside>
      <div class="app">
      <header class="header"></header>
      <main class="main"></main>
      <footer class="footer"></footer>
      </div>
      `
    this.navMenu.render()
    window.location.hash = 'main'
  }
}
export default App
