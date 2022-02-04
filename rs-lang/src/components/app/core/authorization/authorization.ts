import ApiService from '../../api-service/api-service'
import './authorization.css'

//auth-log-in-form
//auth-register-form
//auth-overlay
class Authorization {
  service: ApiService
  constructor(service: ApiService) {
    this.service = service
  }
  renderLogIn() {
    const form = document.querySelector(`.auth-log-in-form`)
    form.classList.remove('hidden')
    form.innerHTML = `
 <div class="form-top">
 <h1>Sign-in</h1>
 <button class="close-form">X</button>
</div>
<div class="form">
 <input type="email" class="form-input email-input" name="e-mail" placeholder="E-mail"
     pattern="^[A-z0-9_\-^\s]{3,15}@[^.]+[A-Za-z0-9]{3,}\.\D{2,}" required="">
 <input type="password" class="form-input password-input">
 <button class="sign-in-button">Sign-in</button>
 <button class="open-registration-button">Register</button>
</div>
 `
 this.addLogInListeners()
  }
  renderAuthorization() {}
  addListener() {
    document.querySelector('.header-log-in-status').addEventListener('click', () => {
      document.querySelector('.auth-overlay').classList.remove('hidden')
      this.renderLogIn()
    })
  }
  addLogInListeners() {
    const form = document.querySelector(`.auth-log-in-form`)
    document.querySelector('close-form').addEventListener('click', () => {
      form.innerHTML = ``
      form.classList.add('hidden')
      document.querySelector('.auth-overlay').classList.add('hidden')
    })
  }
}
export default Authorization
