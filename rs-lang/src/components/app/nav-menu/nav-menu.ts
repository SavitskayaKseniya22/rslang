import ApiService from '../api-service/api-service'
import DifficultySelect from '../core/difficulty-select/difficulty-select'
import MainPage from '../core/main-page/main-page'

class NavMenu {
  service: ApiService
  mainPage: MainPage
  constructor(service: ApiService, mainPage: MainPage) {
    this.service = service
    this.mainPage = mainPage
  }
  render(): void {
    document.querySelector('.navbar').innerHTML = `
      <nav class="page-navigation">
          <a href="#main" class="page-link active-link">Home</a>
          <a href="#text-book" class="page-link">Study</a>
          <a href="#sprint-choose" class="page-link ">Sprint</a>
          <a href="#audio-challenge-choose" class="page-link">Audio</a>
      </nav>
      `
    this.addListeners()
  }
  addListeners(): void {
    window.addEventListener('hashchange', (e) => {
      this.switchPage(e)
    })
  }
  switchPage(e: HashChangeEvent): void {
    document.querySelectorAll('.page-link')?.forEach((link) => {
      link.classList.remove('active-link')
    })
    document.querySelector(`[href='#${e.newURL.split('#')[1]}']`)?.classList.toggle('active-link')
    let page
    switch (e.newURL.split('#')[1]) {
      case 'main':
        page = this.mainPage
        page.render()
      case 'sprint-choose':
        page = new DifficultySelect('sprint', this.service)
        page.render()
        break
      case 'audio-challenge-choose':
        page = new DifficultySelect('audio-challenge', this.service)
        page.render()
        break
    }
  }
}
export default NavMenu
