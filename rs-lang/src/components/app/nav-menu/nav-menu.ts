import ApiService from '../api-service/api-service'
import DifficultySelect from '../core/difficulty-select/difficulty-select'
import MainPage from '../core/main-page/main-page'
import TextBookPage from '../core/text-book-page/text-book-page'

class NavMenu {
  constructor(public service: ApiService, public mainPage: MainPage, public textBook: TextBookPage) {
    this.service = service
    this.mainPage = mainPage
    this.textBook = textBook
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

        break
      case 'text-book':
        page = this.textBook

        break
      case 'sprint-choose':
        page = new DifficultySelect('sprint', this.service)

        break
      case 'audio-challenge-choose':
        page = new DifficultySelect('audio-challenge', this.service)
        page.render()
        break
    }

  }
}
export default NavMenu
