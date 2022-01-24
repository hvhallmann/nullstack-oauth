import Nullstack from 'nullstack';
import Login from '../../layout/Login'

class ClientAuthentication extends Nullstack {

  client_id = ''
  redirect_uri = ''
  response_type = ''
  grant_type = 'authorization_code'
  state = ''
  storefront_name = 'Store Front Name'
  read_profile_data
  read_wallet_address
  read_user_nfts
  
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

  async handleDecline({ router }) {
    router.path = '/'
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
        <br />
        <br />
        <form action='/oauth/authorize' method="post">
          <input type="hidden" bind={this.client_id} />
          <input type="hidden" bind={this.redirect_uri} />
          <input type="hidden" bind={this.response_type} />
          <input type="hidden" bind={this.grant_type} />
          <input type="hidden" bind={this.state} />
          <div class="items-center">
            <ul class="text-left">
              <li>
                <input type="checkbox" name="check_profile" bind={this.read_profile_data} >
                  <label for="check_profile" class="font-['Poppins'] text-lg m-3">
                    Permission to read your profile data
                  </label>
                </input>
              </li>
              <li>
                <input type="checkbox" name="check_wallet" bind={this.read_wallet_address} >
                  <label for="check_wallet" class="font-['Poppins'] text-lg m-3">
                    Permission to read your wallet addresses
                  </label>
                </input>
              </li>
              <li>
                <input type="checkbox" name="check_nfts" bind={this.read_user_nfts} >
                  <label for="check_nfts" class="font-['Poppins'] text-lg m-3">
                    Permission to read your nfts
                  </label>
                </input>
              </li>
            </ul>
          </div>
          <br />
          <br />
          <br />
          <button type="submit" class="px-3 py-2 bg-green-500 hover:bg-green-400 text-white rounded-md">Authorize</button>
          <button onclick={this.handleDecline} class="ml-6 px-3 py-2 hover:bg-gray-50 text-red-500 border-red-500 border rounded-md">Decline</button>
        </form>
      </div>
    )
  }
  
  render({ me }) {
    return (
      <section class="flex m-4 max-w-screen-sm mx-auto flex-col items-center">
        <h1 class="w-full text-center p-2 text-2xl font-semibold text-[#1F2937] uppercase font-['Poppins']">{this.storefront_name} wants Authorization to:</h1>
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