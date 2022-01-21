import Nullstack from "nullstack";
import Home from "./Home";
import Register from "./Register";
import ClientAuthentication from "./pages/oauth/ClientAuthentication";

import HelloWorld from "./HelloWorld";
import HelloWorldSecure from "./HelloWorldSecure"
import ErrorHandler from "./ErrorHandler"

import './tailwind.css'

class Application extends Nullstack {
  
  prepare({ page }) {
    page.locale = "en-US";
  }
  
  static async getAuthenticatedUser({ request }) {
    const { me } = request;
    return me;
  }

  async initiate(context) {
    context.me = await this.getAuthenticatedUser();
  }

  renderHead() {
    return (
      <head>
        <link href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          href="https://fonts.googleapis.com/css2?family=Crete+Round&family=Roboto&display=swap"
          rel="stylesheet"
        />
      </head>
    );
  }

  static async clearSession({ request }) {
    request.session.token = null;
  }

  async logout(context) {
    this.clearSession();
    context.me = null;
  }

  renderHeader({me}) {
    return (
      <div class="flex w-full py-3 px-6">
        { me && me._id && <a onclick={this.logout} class="ml-auto" href="#">Logout</a> }
      </div>
    )
  }

  render({ router }) {
    return (
      <main>
        <Head />
        { router.path !== '/oauth' && <Header /> }
        <Home route="/" />
        <ClientAuthentication route="/oauth" />
        <HelloWorld route="/success" />
        <Register route="/register" />
        <ErrorHandler route="/ops" />
        <HelloWorldSecure route="/secure/success" />
      </main>
    );
  }
}

export default Application;
