import Nullstack from "nullstack";
import Home from "./Home";
import Register from "./Register";
import ClientAuthentication from "./pages/oauth/ClientAuthentication";

import HelloWorld from "./HelloWorld";
import HelloWorldSecure from "./HelloWorldSecure"
import ErrorHandler from "./ErrorHandler"
import ErrorHandlerPermission from "./ErrorHandlerPermission"

import './tailwind.css'
import SignIn from "./SignIn.njs";

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
    if(context.me?._id) {
      //Check if need credentials completion
      if(context.router.path !== '/register' && !context.me.country) {
        context.router.path = '/register'
      }
    }
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
    location.reload();
  }

  renderHeader({me}) {
    return (
      <div class="flex w-full py-3 px-6">
        { me && me._id && <a onclick={this.logout} class="ml-auto" href="#">Logout</a> }
      </div>
    )
  }

  render({ router, me }) {
    return (
      <main class="mx-24">
        <Head />
        { router.path !== '/oauth' && <Header /> }
        <Home route="/" />
        <ClientAuthentication route="/oauth" />
        <Register route="/register" />
        <SignIn route="/signin" />
        <ErrorHandler route="/ops" />
        <>
            { (me && me._id) ? <HelloWorldSecure route="/secured" /> : <ErrorHandlerPermission route="/secured" />}
            {(me && me._id) ? <HelloWorld route="/success" /> : <ErrorHandlerPermission route="/success" />}
        </>
      </main>
    );
  }
}

export default Application;
