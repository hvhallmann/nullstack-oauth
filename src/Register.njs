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
      <section>
        <div> Register </div>
        { this.statusMessage && <p>{ this.statusMessage }</p>}
        <form onsubmit={this.handleFormSubmit}>
          <div>
            <label>First name</label>
            <input type="text" bind={this.firstName} />
          </div>
          <div>
            <label>Last name</label>
            <input type="text" bind={this.lastName}/>
          </div>
          <div>
            <label>Username</label>
            <input type="text" bind={this.username}/>
          </div>
          <div>
            <label>Email</label>
            <input type="email" bind={this.email}/>
          </div>
          <div>
            <label>Password</label>
            <input type="password" bind={this.password}/>
          </div>
          <div>
            <label>Confirm Password</label>
            <input type="password" bind={this.passwordConfirmation}/>
          </div>
          <div>
            <button>Register</button>
          </div>
        </form>
      </section>
    )
  }

}

export default Register;