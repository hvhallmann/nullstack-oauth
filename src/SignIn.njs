import Nullstack from 'nullstack';
import jwt from 'jsonwebtoken'
import { compare } from 'bcryptjs'
import { OAuth2Client } from 'google-auth-library'


class SignIn extends Nullstack {

  errors = {}
  email = ''
  password = ''
  googleAuthorizeUrl = ''
  
  prepare() {
    // your code goes here
  }

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

  static async signIn(data) {
    const { secrets, database, request, email, password } = data

    let errors = {}

    if(!email || !email.length === 0) {
      errors = { ...errors, email: 'E-mail is required' } 
    }
    
    if(!password || !password.length === 0) {
      errors = { ...errors, password: 'Password is required' } 
    }

    if(Object.keys(errors).length > 0) {
      return { errors }
    }

    const userExists = await database.collection('users').findOne({ email: email})
    if(!userExists || !await compare(password, userExists.password)) {
      return { errors: { validation: 'Incorrect email or password.' } }
    } else {
      request.session.token = jwt.sign(userExists._id.toString(), secrets.session)
      delete userExists.password
      
      return { user: userExists, errors }
    }


  }
  
  async initiate({ me, router }) {
    if(me?._id) {
      router.path = '/'
    }
    this.googleAuthorizeUrl = await this.getGoogleAuthorizationUrl()
  }
  
  async hydrate() {
    // your code goes here
  }

  async handleLogin(context) {
    const { me } = context
    const response = await this.signIn({
      email: this.email,
      password: this.password,
    })
 
    
    if(Object.keys(response.errors).length > 0) {
      this.errors = response.errors
      return
    }

    if(response.user) {
      context.me = { ...me, ...response.user, authMethod: 'credentials' }
      context.router.path = '/success'
    }
  }
  
  render() {
    return (
      <section class="w-full flex m-4 mx-auto flex-col items-center">
        <h1 class="w-full text-lg text-center p-2 bold">Sign In</h1>
        <div> 
          <div class="py-6">
            <div class="w-full flex flex-col gap-4">
              <div class="flex flex-col">
                <div class="flex justify-between items-end">
                  <label class="bold mb-1">Enter your email</label>
                  { this.errors.email && <small class="mb-1 text-red-500">{ this.errors.email }</small> }
                </div>
                <input class="py-2 px-3 border border-gray-300 rounded-md" type="email" oninput={() => { 
                  delete this.errors.email
                }} bind={this.email}/>
              </div>
              <div class="flex flex-col">
                <div class="flex justify-between items-end">
                  <label class="bold mb-1">Password</label>
                  { this.errors.password && <small class="mb-1 text-red-500">{ this.errors.password }</small> }
                </div>
                <input class="py-2 px-3 border border-gray-300 rounded-md" type="password" oninput={() => delete this.errors.password} bind={this.password}/>
                <div class="flex flex-col items-center">
                  { this.errors.validation && <p class="text-red-500"><small>{ this.errors.validation }</small></p>}
                  <a class="text-sky-600" href="/forgot-password"><small>Forgot password?</small></a>
                </div>
              </div>
              <div class="flex flex-col mb-6 justify-between">
                <button onclick={ this.handleLogin } class="w-full py-2 px-3 self-center bg-green-500 hover:bg-green-400 text-white rounded-md">Sign In</button>
                <a href={this.googleAuthorizeUrl} class="w-full mt-3 flex flex-row items-center py-2 px-3 self-center border border-gray-300 rounded-md">
                  <svg class="mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                    </g>
                    <script xmlns="" type="text/javascript" src="chrome-extension://hejbmebodbijjdhflfknehhcgaklhano/../window/testing-library.js"/>
                  </svg>
                  Sign in with Google
                </a>
              </div>
              <div class="text-center">
                <p>Don't have an account yet?</p> 
                <a class="text-sky-600" href="/register">Create account</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

}

export default SignIn;