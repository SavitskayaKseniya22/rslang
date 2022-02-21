import { ButtonProperties } from '../interfaces/interfaces'

class Button {
  public element = document.createElement('button')
  constructor({ text, className }: ButtonProperties) {
    this.addClassName(className).addText(text)
  }
  private addText(text: string) {
    this.element.textContent = text
    return this
  }
  private addClassName(className: string) {
    this.element.classList.add(className)
    return this
  }
}

export default Button
