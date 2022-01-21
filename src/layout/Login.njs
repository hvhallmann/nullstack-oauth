import Nullstack from 'nullstack';
import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'

class Login extends Nullstack {

  username = ''
  password = ''
  error = ''
  
  prepare() {
    // your code goes here
  }
  
  async initiate() {
    // your code goes here
  }
  
  async hydrate() {
  }

  static async attemptLoginOrSignup({ database, request, secrets, username, password }) {
    if (!username || !password) {
      return { error: 'Fill all the fields' };
    }

    let userFound = await database.collection('users').findOne({
      username: username
    })

    if(!userFound || !await compare(password, userFound.password)) {
      return { error: 'Invalid credentials' }
    } else {
      request.session.token = jwt.sign(userFound._id.toString(), secrets.session);
      delete userFound.password;
      
      return { user: userFound };
    }
  }

  async handleLoginFormSubmit(context) {
    const { me } = context
    const { user, error } = await this.attemptLoginOrSignup({
      username: this.username,
      password: this.password,
    });
    if (error) {
      this.error = error;
    } else {
      context.me = { ...me, ...user, authMethod: 'credentials' }
    }
  }  
  
  render() {
    return (
      <div class="flex flex-col">
        <h1 class="text-center">Login</h1>
        <form class="flex flex-col gap-2 p-2" onsubmit={this.handleLoginFormSubmit}>
          { this.error && <p class="text-red-500">{ this.error }</p> }
          <div class="flex flex-col">
            <label for="username">Username</label>
            <input class="py-2 px-3 border border-gray-300 rounded-md" type="text" id="username" bind={this.username} />
          </div>
          <div class="flex flex-col">
            <label for="password">Password</label>
            <input class="py-2 px-3 border border-gray-300 rounded-md" type="password" id="password" bind={this.password} />
          </div>
          <button class="py-2 px-3 self-center bg-sky-500 hover:bg-sky-400 text-white rounded-md" type="submit">Login</button>
        </form>
      </div>
    )
  }

}

export default Login;