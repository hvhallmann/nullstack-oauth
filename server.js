import Nullstack from 'nullstack';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken'
import Application from './src/Application';
import { ObjectId } from 'mongodb'

import OAuth2Server from 'oauth2-server'
import { OAuth2Client } from 'google-auth-library'

import OAuthConfig from './src/config/oauth.njs'
import cookieSession from 'cookie-session';
import { generateModel } from './oauth/model'

import AuthorizeRoutes from './src/routes/oauth/authorize'
import TokenRoutes from './src/routes/oauth/token'
import SecureRoutes from './src/routes/oauth/secure'

let oauth

const context = Nullstack.start(Application);
const {
  server,
  secrets
} = context;

server.use(cookieSession({
  name: 'session',
  keys: ['token'],
}))

server.use(async (request, response, next) => {
  const {
    organization
  } = request;
  if (!request.session.token) {
    request.me = null;
  } else {
    try {
      const id = jwt.verify(request.session.token, secrets.session)
      const user = await context.database.collection('users').findOne({
        _id: ObjectId(id)
      });
      delete user.password;
      request.me = {
        ...user
      };
    } catch (error) {
      console.log(error)
      request.me = null;
      request.session.token = null;
    }
  }
  next();
})

context.start = async function start() {
  // https://nullstack.app/application-startup
  const databaseClient = new MongoClient('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await databaseClient.connect();

  const database = databaseClient.db('oauth');
  context.database = database;

  oauth = new OAuth2Server({
    model: generateModel(database),
    ...OAuthConfig
  })
}

server.use((req, res, next) => {
  req.oauth = oauth
  return next()
})


/**
 * Start Google Auth by acquiring a pre-authenticated oAuth2 client.
 */
if (!secrets.googleClientId) {
  console.error('Failed to identify google auth secrets')
}
const oAuth2Client = new OAuth2Client(
  secrets.googleClientId,
  secrets.googleClientSecret,
  secrets.redirectUris
);

server.use(bodyParser.urlencoded({
  extended: false
}));
server.use(bodyParser.json());

server.use('/client', require('./routes/client.js')) // Client routes

server.post('/oauth/authorize', AuthorizeRoutes)
server.post('/oauth/token', TokenRoutes)
// Note that the next router uses middleware. That protects all routes within this middleware
server.use('/secure', SecureRoutes)

server.use('/oauth2start', async (req, res) => {
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
  });

  return res.redirect(authorizeUrl)
})

server.use('/oauth2callback', async (req, res) => {
  try {
    const {
      code,
      scope
    } = req.query

    if (!code) {
      console.log('-- not code found --')
      const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
      });
      return res.redirect(authorizeUrl)
    }

    // Now that we have the code, use that to acquire tokens.
    const r = await oAuth2Client.getToken(code);
    // Make sure to set the credentials on the OAuth2 client.
    oAuth2Client.setCredentials(r.tokens);
    console.info('Tokens acquired.');

    const urlInfo = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json'
    const respauth = await oAuth2Client.request({
      url: urlInfo
    }); //can be scope from query

    if (!respauth.data.email) {
      console.error("user email not identified");
    }
 
    let user;
    
    user = await context.database.collection('users').findOne({email: respauth.data.email})
  
    if (!user) {
      user = {
        firstName: respauth.data.given_name,
        lastName: respauth.data.family_name,
        email: respauth.data.email,
        username: respauth.data.id,
      }
      const { insertedId } = context.database.collection('users').insertOne(user)
      Object.assign(user, { _id: insertedId })
    }

    req.session.token = jwt.sign(user._id.toString(), secrets.session);
    
    delete user.password;
    req.me = {...user, authMethod: 'google'}
  
    // After acquiring an access_token, you may want to check on the audience, expiration,
    // or original scopes requested.  You can do that with the `getTokenInfo` method.
    // const tokenInfo = await oAuth2Client.getTokenInfo(
    //   oAuth2Client.credentials.access_token
    // );
    // console.log('tokenInfo', tokenInfo);

    return res.redirect('/success')
  } catch (error) {
    console.error("Unexpected error", error);
    return res.redirect('/ops')
  }

})

export default context;