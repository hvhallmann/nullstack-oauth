import Nullstack from 'nullstack';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import { compare } from 'bcryptjs'
import Application from './src/Application';

import OAuth2Server from 'oauth2-server'
import OAuthConfig from './src/config/oauth.njs'
import { generateModel } from './oauth/model'
import { handleResponse } from './src/utils/handleResponse.njs'
import { handleError } from './src/utils/handleError.njs'

import { OAuth2Client } from 'google-auth-library'
const url = require('url');

let oauth

const context = Nullstack.start(Application);

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

const { server, secrets } = context;

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use('/client', require('./routes/client.js')) // Client routes
server.use('/oauth', require('./routes/auth.js')) // routes to access the auth stuff

server.post('/oauth/authorize', async (req, res, next) => {

  const { username, password } = req.body
  const user = await context.database.collection('users').findOne({ username })
  if(user && await compare(password, user.password)) {
    req.body.user = user
    return next()
  }

  const params = [ // Send params back down
    'client_id',
    'redirect_uri',
    'response_type',
    'grant_type',
    'state',
  ]
    .map(a => `${a}=${req.body[a]}`)
    .join('&')
  return res.redirect(`/oauth?success=false&${params}`)

}, async (req, res, next) => {

  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);
  
  try {
    const code = await oauth.authorize(request, response, {
      authenticateHandler: {
        handle: req => {
          console.log('Authenticate Handler')
          console.log(Object.keys(req.body).map(k => ({name: k, value: req.body[k]})))
          return req.body.user
        }
      }
    })
    res.locals.oauth = {code: code};

    return handleResponse(req, res, response)
  } catch (err) {
    return handleError(err, req, res, response, next)
  }
  
})

server.post('/oauth/token', async (req, res, next) => {
  next()
}, async (req, res, next) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);
  try {
    const token = await oauth.token(request, response, {
      requireClientAuthentication: { // whether client needs to provide client_secret
        // 'authorization_code': false,
      },
    });
    res.locals.oauth = { token: token };
    return handleResponse(req, res, response)
  } catch (err) {
    return handleError(err, req, res, response, next)
  }
  
})
// Note that the next router uses middleware. That protects all routes within this middleware
server.use('/secure', (req,res,next) => {
    return next()
  }, 
  async (req, res, next) => {
    const request = new OAuth2Server.Request(req)
    const response = new OAuth2Server.Response(res)

    try {
      const token = await oauth.authenticate(request, response, {})
      res.locals.oauth = { token: token };
      next();
    } catch (err) {
      return handleError(err, req, res, response, next)
    }
  },
  require('./routes/secure.js')
)

/**
* Start by acquiring a pre-authenticated oAuth2 client.
*/
const oAuth2Client = new OAuth2Client(
  secrets.googleClientId,
  secrets.googleClientSecret,
  secrets.redirectUris
);

server.use('/oauth2start', async (req,res) => {
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
  })

  return res.redirect(authorizeUrl)
})

server.use('/oauth2callback', async (req,res) => {
  const { code, scope } = req.query
  
  const r = await oAuth2Client.getToken(code)
  oAuth2Client.setCredentials(r.tokens)

  const url = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json'
  const resp = await oAuth2Client.request({url})
  console.log(resp.data)

  return res.redirect('/success')

})

// server.use('/', (req,res) => res.redirect('/client'))

export default context;
