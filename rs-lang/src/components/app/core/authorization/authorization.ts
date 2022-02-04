import ApiService from '../../api-service/api-service'
import { FormInfo } from '../../interfaces/interfaces'
import './authorization.css'

//auth-log-in-form
//auth-register-form
//auth-overlay


class Authorization {
  service: ApiService
  
  formData:FormInfo
  constructor(service: ApiService) {
    this.service = service
    this.formData = {
        email:'',
        password:'',
    }
  }
  renderLoggedIn(){
    document.querySelector('.header-log-in-status')?.remove()
    const logged = document.createElement('div')
    logged.classList.add('header-logged-in-status')
    logged.innerHTML = `
    <div>Name</div>
    <div>Log out?</div>
    `
    document.querySelector('.header').append(logged)

  }
  renderLogIn() {
    document.querySelector('.auth-overlay').classList.remove('hidden')
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
 <input type="password" placeholder="Password" minlength="8" class="form-input password-input" required> 
 <button class="sign-in-button submit-btn">Sign-in</button>
 <button class="open-registration-button switch-form-btn">Register</button>
</div>
 `
 this.addLogInListeners()
  }
  renderAuthorization() {
    document.querySelector('.auth-overlay').classList.remove('hidden')
    const form = document.querySelector(`.auth-register-form`)
    form.classList.remove('hidden')
    form.innerHTML = `
 <div class="form-top">
 <h1>Register</h1>
 <button class="close-form">X</button>
</div>
<div class="form">
 <input type="email" class="form-input email-input" name="e-mail" placeholder="E-mail"
     pattern="^[A-z0-9_\-^\s]{3,15}@[^.]+[A-Za-z0-9]{3,}\.\D{2,}" required="">
     <input type="password" placeholder="Password" minlength="8" class="form-input password-input" required> 
     <input type="text" placeholder="Name" minlength="1" class="form-input name-input" required> 
 <button class="register-button submit-btn">Register</button>
 <button class="open-sign-in-button switch-form-btn">Sign-in</button>
 <button class="open-sign-in-button ">DELETE USER</button>
</div>
 `
 this.addRegisterListeners()
  }
  addListener() {
    document.querySelector('.header-log-in-status').addEventListener('click', ()=>{
        this.renderLogIn()
    })
  }
  addLogInListeners() {
    const eMail =  document.querySelector('.email-input') as HTMLInputElement
    const pWord =  document.querySelector('.password-input') as HTMLInputElement
    const form = document.querySelector(`.auth-log-in-form`)
    document.querySelector('.close-form').addEventListener('click', () => {
     console.log('closing form')
      form.innerHTML = ``
      form.classList.add('hidden')
      document.querySelector('.auth-overlay').classList.add('hidden')
    })
    document.querySelector('.open-registration-button').addEventListener('click', ()=>{
        form.innerHTML=''
        form.classList.add('hidden')
        this.renderAuthorization()
    })
    document.querySelector('.email-input').addEventListener('input', (e)=>{
        this.formData.email = (e.target as HTMLInputElement).value
        console.log(this.formData.email)
    })
    document.querySelector('.password-input').addEventListener('input', (e)=>{
        this.formData.password = (e.target as HTMLInputElement).value
        console.log(this.formData.password)
    })
    document.querySelector('.submit-btn').addEventListener('click',async ()=>{
        if(eMail.validity.valid && pWord.validity.valid){
            console.log('everything is guchi logging in user')
             const resp = await this.service.requestLogIn(this.formData)
             console.log('user has sucessfully logged in', resp)
             form.innerHTML = ``
             form.classList.add('hidden')
             document.querySelector('.auth-overlay').classList.add('hidden')
             this.formData = {
                email:'',
                password:'',
            }
            this.renderLoggedIn()
             
        } else{
            console.log('oops')
         }
         })
  }
  addRegisterListeners(){
      const eMail =  document.querySelector('.email-input') as HTMLInputElement
      const pWord =  document.querySelector('.password-input') as HTMLInputElement
      const nom =  document.querySelector('.name-input') as HTMLInputElement
    const form = document.querySelector(`.auth-register-form`)
    document.querySelector('.close-form').addEventListener('click', () => {
      form.innerHTML = ``
      form.classList.add('hidden')
      document.querySelector('.auth-overlay').classList.add('hidden')
    })
    document.querySelector('.open-sign-in-button').addEventListener('click', ()=>{
        form.innerHTML=''
        form.classList.add('hidden')
        this.renderLogIn()
    })
    document.querySelector('.email-input').addEventListener('input', (e)=>{
        this.formData.email = (e.target as HTMLInputElement).value
        console.log(this.formData.email)
    })
    document.querySelector('.password-input').addEventListener('input', (e)=>{
        this.formData.password = (e.target as HTMLInputElement).value
        console.log(this.formData.password)
    })
    document.querySelector('.name-input').addEventListener('input', (e)=>{
        this.formData.name = (e.target as HTMLInputElement).value
        console.log(this.formData.password)
    })
    document.querySelector('.register-button').addEventListener('click',async ()=>{
   if(eMail.validity.valid && pWord.validity.valid && nom.validity.valid){
       console.log('everything is guchi creating user....')
        const resp = await this.service.requestRegistration(this.formData)
        console.log('user was sucessfully created', resp)
        this.formData = {
            email:'',
            password:'',
        }

   } else{
       console.log('oops')
    }
    })
  }
 
}
export default Authorization
