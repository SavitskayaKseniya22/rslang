class ImageIconVoice {
  element = document.createElement('img')

  addIconVoice(path: string) {
    this.element.setAttribute('src', path)
    this.element.setAttribute('alt', 'icon voice')
    return this.element
  }
}
export default ImageIconVoice
