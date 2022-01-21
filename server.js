import Nullstack from 'nullstack';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken'
import cookieSession from 'cookie-session';
import OAuth2Server from 'oauth2-server'

import { MongoClient, ObjectId } from 'mongodb';
import { OAuth2Client } from 'google-auth-library'


import { generateModel } from './oauth/model'
import Application from './src/Application';
import OAuthConfig from './src/config/oauth.njs'
import AuthorizeRoutes from './src/routes/oauth/authorize'
import TokenRoutes from './src/routes/oauth/token'
import SecureRoutes from './src/routes/oauth/secure'
import oauth2callback from './src/routes/oauth/google'

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

server.use('/oauth2callback', async (req, res) => oauth2callback(req, res, context.database, oAuth2Client, secrets))

export default context;