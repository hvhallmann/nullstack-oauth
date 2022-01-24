import Nullstack from 'nullstack';
import { hash } from 'bcryptjs';

import { OAuth2Client } from 'google-auth-library'

class Register extends Nullstack {

  step = 1

  errors = {}

  firstName = ''
  lastName = ''
  email = ''
  username = ''
  password = ''
  passwordConfirmation = ''
  country = ''
  wallet_type = 'flow'
  wallet = ''

  countryList = ''
  statusMessage = ''

  googleAuthorizeUrl = ''
  
  prepare() {}

  static async getGoogleAuthorizationUrl({ secrets }) {
     const oAuth2Client = new OAuth2Client(
      secrets.googleClientId,
      secrets.googleClientSecret,
      secrets.redirectUris
    );
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    });
    return authorizeUrl
  }

  static async getCountryList() {
    const response = await fetch('http://country.io/names.json')
    return await response.json()
  }
  
  async initiate({ me }) {
    if(me?._id) {
      this.email = me.email
      
      if(!me.country) {
        this.step = 2
      }
    } else {
      this.step = 1
    }
    this.googleAuthorizeUrl = await this.getGoogleAuthorizationUrl()

    try {
      this.countryList = await this.getCountryList()
    } catch (err) {}
  }
  
  async hydrate() {
    // your code goes here
  }

  static async validateFirstStep(data) {
    const {
      database,
      email,
      password,
      passwordConfirmation
    } = data

    let errors = {}

    if(!email || email === '') {
      errors = { ...errors, email: 'E-mail is required' }
    } else {
      const userExists = await database.collection('users').findOne({ email: email})
      if(userExists) {
        errors = { ...errors, email: 'E-mail already taken' }
      }
    }
    if(!password || password === '') {
      errors = { ...errors, password: "Invalid Format" }
    }
    if(password !== passwordConfirmation) {
      errors = { ...errors, passwordConfirmation: "Password doesn't match" }
    }

    if(!!Object.keys(errors).length) return { errors }

    return { errors }
  }
  
  static async validateFirstTwo(data) {
    const {
      country,
    } = data

    let errors = {}

    if(!country || country === '') {
      errors = { ...errors, country: 'Country is required' }
    }

    if(!!Object.keys(errors).length) return { errors }

    return { errors }
  }

  static async createAccount(data) {
    const { database, email, password, country } = data

    //TODO: Validation before create in db
    
    const { insertedId } = await database.collection('users').insertOne({
      email,
      country,
      password: await hash(password, 10),
    })

    return !!insertedId
  }

  async handleStepOneSignUp({ router }) {

    this.errors = {}

    const response = await this.validateFirstStep({
      email: this.email,
      password: this.password,
      passwordConfirmation: this.passwordConfirmation
    })

    if(!!Object.keys(response.errors).length) {
      this.errors = response.errors
      return
    }

    this.step = 2
    // this.statusMessage = 'New user created!'
    // router.path = '/success'
  }

  async handleStepTwoNext() {

    const response = await this.validateFirstTwo({
      country: this.country
    })

    if(!!Object.keys(response.errors).length) {
      this.errors = response.errors
      return
    }
    
    this.step = 3
  }

  async handleCreateAccount() {
    const response = await this.createAccount({
      email: this.email,
      password: this.password,
      country: this.country,
      // wallet: '???'
    })

    console.log(response)
  }

  renderSteps({ me }) {
    return (
      <div class="w-full text-center">
        <ul class="inline-grid grid-flow-col gap-8 bold relative">
          <li class="grid">
            <span onclick={() => {
              if(!me?._id) {
                this.step = 1
              }
            }} class="cursor-pointer flex mx-auto justify-center items-center bg-sky-600 text-white h-10 w-10 rounded-full">1</span>
          </li>
          <li class={
            `${this.step >= 2 ? 'before:border-sky-600' : ''}
              grid
              relative
              before:absolute
              before:border-b-2
              before:w-full
              before:border-dashed
              before:-left-10
              before:top-5
              before:-z-10`
          }>
            { this.step >= 2 
              ? <span onclick={{ step: 2}} class="cursor-pointer flex mx-auto justify-center items-center bg-sky-600 text-white h-10 w-10 rounded-full">2</span>
              : <span class="flex mx-auto justify-center items-center bg-gray-300 text-gray-500 h-10 w-10 rounded-full">2</span>
            }
          </li>
          <li class={
            `${this.step >= 2 ? 'before:border-sky-600' : ''}
              grid
              relative
              before:absolute
              before:border-b-2
              before:w-full
              before:border-dashed
              before:-left-10
              before:top-5
              before:-z-10`
          }>
            { this.step >= 3 
              ? <span onclick={{ step: 3}} class="cursor-pointer flex mx-auto justify-center items-center bg-sky-600 text-white h-10 w-10 rounded-full">3</span>
              : <span class="flex mx-auto justify-center items-center bg-gray-300 text-gray-500 h-10 w-10 rounded-full">3</span>
            }
          </li>
        </ul>
      </div>
    )
  }
  
  renderStepOne() {
    return (
      <div class="w-full flex flex-col gap-4">
        <div class="flex flex-col">
          <div class="flex justify-between items-end">
            <label class="bold mb-1">Email*</label>
            { this.errors.email 
              ? <small class="mb-1 text-red-500">{ this.errors.email }</small>
              : <small class="mb-1 text-gray-400 bold">{ this.email.length }/50</small>
            }
          </div>
          <input class="py-2 px-3 border border-gray-300 rounded-md" type="email" oninput={() => { 
            if(this.email.length > 50) {
              this.email = this.email.slice(0, 50)
            }
          }} bind={this.email}/>
        </div>
        <div class="flex flex-col">
          <div class="flex justify-between items-end">
            <label class="bold mb-1">Password</label>
            { this.errors.password && <small class="mb-1 text-red-500">{ this.errors.password }</small> }
          </div>
          <input class="py-2 px-3 border border-gray-300 rounded-md" type="password" bind={this.password}/>
        </div>
        <div class="flex flex-col">
          <div class="flex justify-between items-end">
            <label class="bold mb-1">Confirm Password</label>
            { this.errors.passwordConfirmation && <small class="mb-1 text-red-500">{ this.errors.passwordConfirmation }</small> }
          </div>
          <input class="py-2 px-3 border border-gray-300 rounded-md" type="password" bind={this.passwordConfirmation}/>
        </div>
        <div>
          <p>You already have an account? <a class="text-sky-600" href="/login">Sign In</a></p>
        </div>
        <div class="flex justify-between">
          <button onclick={ this.handleStepOneSignUp } class="py-2 px-3 self-center bg-green-500 hover:bg-green-400 text-white rounded-md">Sign Up</button>
          <a href={this.googleAuthorizeUrl} class="flex flex-row items-center py-2 px-3 self-center border border-gray-300 rounded-md">
            <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
              <script xmlns="" type="text/javascript" src="chrome-extension://hejbmebodbijjdhflfknehhcgaklhano/../window/testing-library.js"/>
            </svg>
            Sign up with Google
          </a>
        </div>
      </div>
    )
  }
  renderStepTwo() {
    return (
      <div class="w-full flex flex-col gap-4">
        <div class="flex flex-col">
          <div class="flex justify-between items-end">
            <label class="bold mb-1">Country</label>
            { this.errors.country && <small class="mb-1 text-red-500">{ this.errors.country }</small> }
          </div>
          <select bind={this.country} class="py-2 px-3 border border-gray-300 rounded-md">
            <option value="">Select a Country</option>
            { Object.keys(this.countryList).map(country => (
              <option value={this.countryList[country]}>{ this.countryList[country] }</option>
            )) }
          </select>
        </div>
        <div class="flex flex-col">
          <label class="bold mb-1">Other Question</label>
          <input class="py-2 px-3 border border-gray-300 rounded-md" type="text"/>
        </div>
        <div class="flex flex-col">
          <label class="bold mb-1">Other Question</label>
          <input class="py-2 px-3 border border-gray-300 rounded-md" type="text"/>
        </div>
        <div class="flex justify-between">
          <button onclick={this.handleStepTwoNext} class="py-2 px-3 self-center bg-green-500 hover:bg-green-400 text-white rounded-md">Next</button>
        </div>
      </div>
    )
  }

  renderStepThree() {
    return (
      <div class="w-full flex flex-col gap-8 text-center">
        <div class="flex flex-col">
          <label class="bold mb-6">Connect your wallet</label>
          <select bind={this.wallet_type} class="py-2 px-3 border border-gray-300 rounded-md">
            <option value="flow">Flow</option>
          </select>
        </div>
        <div class="flex justify-center">
          <span class="mr-2">Connect with</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="87" height="28" viewBox="0 0 383 128" fill="none">
            <path d="M327.262 119.94V127.998H382.57V91.6548H374.511V119.94H327.262ZM327.262 0V8.05844H374.511V36.3452H382.57V0H327.262ZM298.74 62.3411V43.6158H311.382C317.546 43.6158 319.758 45.6696 319.758 51.2803V54.5982C319.758 60.3657 317.624 62.3411 311.382 62.3411H298.74ZM318.808 65.6589C324.575 64.1578 328.604 58.7842 328.604 52.3856C328.604 48.3564 327.025 44.7211 324.023 41.7972C320.23 38.1619 315.172 36.3452 308.615 36.3452H290.838V91.6529H298.74V69.6097H310.592C316.675 69.6097 319.125 72.1378 319.125 78.4599V91.6548H327.184V79.7239C327.184 71.0325 325.13 67.7147 318.808 66.7662V65.6589ZM252.282 67.4756H276.618V60.207H252.282V43.6139H278.988V36.3452H244.222V91.6529H280.173V84.3842H252.282V67.4756ZM225.812 70.3995V74.1916C225.812 82.1717 222.888 84.78 215.541 84.78H213.803C206.454 84.78 202.899 82.4088 202.899 71.4264V56.5717C202.899 45.5109 206.613 43.2181 213.96 43.2181H215.539C222.73 43.2181 225.021 45.9048 225.099 53.3322H233.791C233.001 42.4283 225.732 35.5555 214.828 35.5555C209.535 35.5555 205.11 37.2153 201.792 40.3745C196.814 45.0367 194.049 52.9383 194.049 63.9991C194.049 74.6659 196.42 82.5675 201.318 87.4649C204.636 90.7044 209.219 92.4426 213.723 92.4426C218.463 92.4426 222.81 90.5456 225.021 86.438H226.126V91.6529H233.395V63.1309H211.983V70.3995H225.812ZM156.126 43.6139H164.739C172.878 43.6139 177.303 45.6677 177.303 56.7304V71.2677C177.303 82.3285 172.878 84.3842 164.739 84.3842H156.126V43.6139ZM165.449 91.6548C180.541 91.6548 186.149 80.1982 186.149 64.001C186.149 47.5666 180.145 36.3471 165.29 36.3471H148.223V91.6548H165.449ZM110.063 67.4756H134.399V60.207H110.063V43.6139H136.768V36.3452H102.002V91.6529H137.954V84.3842H110.063V67.4756ZM63.4464 36.3452H55.3879V91.6529H91.7332V84.3842H63.4464V36.3452ZM0 91.6548V128H55.3076V119.94H8.05844V91.6548H0ZM0 0V36.3452H8.05844V8.05844H55.3076V0H0Z" fill="black"/>
            <script xmlns="" type="text/javascript" src="chrome-extension://hejbmebodbijjdhflfknehhcgaklhano/../window/testing-library.js"/>
          </svg>
        </div>
        <div class="flex">
          <p>You will be able to connect more wallets in your account settings later</p>
        </div>
        <div class="flex justify-center">
          <button onclick={this.handleCreateAccount} class="py-2 px-3 self-center bg-green-500 hover:bg-green-400 text-white rounded-md">Create Account</button>
        </div>
      </div>
    )
  }
  
  render() {
    return (
      <section class="flex m-4 mx-auto flex-col items-center">
        <h1 class="w-full text-lg text-center p-2 bold">Create your account</h1>
        { this.statusMessage && <p class="text-red-500">{ this.statusMessage }</p>}
        <div class="w-3/12"> 
          <div class="py-6">
            <Steps />
          </div>
          { this.step === 1 && <StepOne /> }
          { this.step === 2 && <StepTwo /> }
          { this.step === 3 && <StepThree /> }
        </div>
        {/* <form class="flex w-full flex-col gap-2 p-2 px-6" onsubmit={this.handleCreateAccount}>
          <div class="flex flex-col">
            <label>First name</label>
            <input class="py-2 px-3 border border-gray-300 rounded-md" type="text" bind={this.firstName} />
          </div>
          <div class="flex flex-col">
            <label>Last name</label>
            <input class="py-2 px-3 border border-gray-300 rounded-md" type="text" bind={this.lastName}/>
          </div>
          <div class="flex flex-col">
            <label>Username</label>
            <input class="py-2 px-3 border border-gray-300 rounded-md" type="text" bind={this.username}/>
          </div>
          <div class="flex flex-col">
            <label>Email</label>
            <input class="py-2 px-3 border border-gray-300 rounded-md" type="email" bind={this.email}/>
          </div>
          <div class="flex flex-col">
            <label>Password</label>
            <input class="py-2 px-3 border border-gray-300 rounded-md" type="password" bind={this.password}/>
          </div>
          <div class="flex flex-col">
            <label>Confirm Password</label>
            <input class="py-2 px-3 border border-gray-300 rounded-md" type="password" bind={this.passwordConfirmation}/>
          </div>
          <div class="flex">
            <button class="py-2 px-3 self-center bg-sky-500 hover:bg-sky-400 text-white rounded-md">Register</button>
          </div>
        </form> */}
      </section>
    )
  }

}

export default Register;