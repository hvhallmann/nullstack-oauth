import Nullstack from 'nullstack';
import Login from '../../layout/Login'

class ClientAuthentication extends Nullstack {

  client_id = ''
  redirect_uri = ''
  response_type = ''
  grant_type = 'authorization_code'
  state = ''
  
  prepare({params}) {
    this.client_id = params.client_id
    this.redirect_uri = params.redirect_uri
    this.response_type = params.response_type
    this.grant_type = params.grant_type
    this.state = params.state
  }
  
  async initiate(context) {
    // your code goes here
  }
  
  async hydrate() {
    // your code goes here
  }

  renderConcentment({ me }) {
    return(
      <div class="text-center">
        <p class="text-lg">Account information</p>
        <div class="p-4">
          <p>
            <strong>Name</strong> { me.firstName } { me.lastName }
          </p>
          <p>
            <strong>E-mail</strong> { me.email }
          </p>
        </div>
        <form action='/oauth/authorize' method="post">
          <input type="hidden" bind={this.client_id} />
          <input type="hidden" bind={this.redirect_uri} />
          <input type="hidden" bind={this.response_type} />
          <input type="hidden" bind={this.grant_type} />
          <input type="hidden" bind={this.state} />
          <button type="submit" class="px-3 py-2 bg-red-500 hover:bg-red-400 text-white rounded-md">Continue</button>
        </form>
        <div class="mt-4">
          <small>To continue, <strong>Marketplace</strong> will share your name, email address, with Flow Market Node.</small>
        </div>
      </div>
    )
  }
  
  render({ me }) {
    return (
      <section class="flex m-4 max-w-screen-sm mx-auto flex-col items-center border rounded-md border-gray-200">
        <h1 class="w-full text-center p-2 border-b border-gray-200">Authentication On Our Server</h1>
        <div class="p-4">
          { me && me._id
            ? <Concentment />
            : <Login />
          }
        </div>
      </section>
    )
  }

}

export default ClientAuthentication;