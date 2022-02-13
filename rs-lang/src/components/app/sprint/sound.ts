export class Sound {
  url: string
  constructor(url: string) {
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
    <audio class="sprint__sound" src=https://react-learnwords-example.herokuapp.com/${this.url}></audio>
    </button>`
  }
}
