import Nullstack from 'nullstack';
import { hash } from 'bcryptjs';

class Register extends Nullstack {

  firstName = ''
  lastName = ''
  email = ''
  username = ''
  password = ''
  passwordConfirmation = ''

  statusMessage = ''
  
  prepare() {
    // your code goes here
  }
  
  async initiate() {
    // your code goes here
  }
  
  async hydrate() {
    // your code goes here
  }

  static async createUser(data) {
    const {
      database,
      firstName,
      lastName,
      email,
      username,
      password,
      passwordConfirmation
    } = data

    if(!firstName || firstName === '') {
      return { error: "First name is required" }
    }
    if(!lastName || lastName === '') {
      return { error: "Last name is required" }
    }
    if(!email || email === '') {
      return { error: "Email is required" }
    }
    if(!username || username === '') {
      return { error: "Username is required" }
    }
    if(password !== passwordConfirmation) {
      return { error: "Password confirmation fail" }
    }

    return await database.collection('users').insertOne({
      firstName,
      lastName,
      email,
      username,
      password: await hash(password, 10),
    })
  }

  async handleFormSubmit({ router }) {

    this.statusMessage = ''

    const response = await this.createUser({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      username: this.username,
      password: this.password,
      passwordConfirmation: this.passwordConfirmation
    })

    if(response.error) {
      this.statusMessage = response.error
      return
    }

    this.statusMessage = 'New user created!'
    router.path = '/client'
  }
  
  render() {
    return (
      <section class="flex m-4 max-w-screen-sm mx-auto flex-col items-center border rounded-md border-gray-200">
        <h1 class="w-full text-lg text-center p-2">Login</h1>
        <form class="flex w-full flex-col gap-2 p-2 px-6" onsubmit={this.handleFormSubmit}>
          { this.statusMessage && <p class="text-red-500">{ this.statusMessage }</p>}
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
        </form>
      </section>
    )
  }

}

export default Register;