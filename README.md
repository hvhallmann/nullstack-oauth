# Null Test

<img src='https://raw.githubusercontent.com/nullstack/nullstack/master/nullstack.png' height='60' alt='Nullstack' />

## How to run this Project

Install the dependencies:

`npm install`

Copy the environment sample to a .env file

```sh
NULLSTACK_PROJECT_NAME="[dev] Null Test"
NULLSTACK_PROJECT_DOMAIN="localhost"
NULLSTACK_PROJECT_COLOR="#D22365"
NULLSTACK_SERVER_PORT="3000"
```

Run the app in development mode:

`npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Learn more about Nullstack

[Read the documentation](https://nullstack.app/documentation)

## Oauth-handler2

There is a piece of code that is not working on the lib oauth2-server:

```js
For this to work, you are going have to hack this a little bit:
    1. navigate to the node_modules folder
    2. find the oauth_server folder. (node_modules/express-oauth-server/node_modules/oauth2-server)
    3. open lib/handlers/authorize-handler.js
    4. Make the following change (around line 136):

    AuthorizeHandler.prototype.generateAuthorizationCode = function (client, user, scope) {
      if (this.model.generateAuthorizationCode) {
        // Replace this
        //return promisify(this.model.generateAuthorizationCode).call(this.model, client, user, scope);
        // With this
        return this.model.generateAuthorizationCode(client, user, scope)
      }
      return tokenUtil.generateRandomToken();
    };
```

We need to branch this lib to make it work
