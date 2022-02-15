import { SprintSettings } from '../interfaces/interfaces'

export class Sound {
  url: string
  settings: SprintSettings
  constructor(url: string, settings: SprintSettings) {
    this.settings = settings
    this.url = url
    this.initListener()
  }

  initListener() {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (target.closest('.sprint__toggle-sound')) {
        ;(target.closest('.sprint__toggle-sound').querySelector('.sprint__sound') as HTMLAudioElement).play()
      }
    })
  }

  render() {
    return `<button class="sprint__toggle-sound">
    <i class="fas fa-play-circle"></i>
    <audio class="sprint__sound" src=${this.settings.service.apiUrl}/${this.url}></audio>
    </button>`
  }
}
