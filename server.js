import Nullstack from 'nullstack';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import { compare } from 'bcryptjs'
import Application from './src/Application';

import OAuth2Server from 'oauth2-server'
import { OAuth2Client } from 'google-auth-library'

import { generateModel } from './oauth/model'

import OAuthConfig from './src/config/oauth.njs'
import { handleError } from './src/utils/handleError.njs'
import { handleResponse } from './src/utils/handleResponse.njs'

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

server.use('/oauth2start', async (req,res) => {
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
  });

  return res.redirect(authorizeUrl)
})

server.use('/oauth2callback', async (req,res) => {
  try {
    const { code, scope } = req.query
  
    // Now that we have the code, use that to acquire tokens.
    const r = await oAuth2Client.getToken(code);
    // Make sure to set the credentials on the OAuth2 client.
    oAuth2Client.setCredentials(r.tokens);
    console.info('Tokens acquired.');
    
    const urlInfo = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json'
    const respauth = await oAuth2Client.request({url: urlInfo}); //can be scope from query
    console.log(respauth.data);
  
    if (!respauth.data.email) {
      console.error("user email not identified");
    }
  
    const findUser = await context.database.collection('users').findOne({email: respauth.data.email})
  
    if (!findUser) {
      context.database.collection('users').insertOne({
        firstName: respauth.data.given_name,
        lastName: respauth.data.family_name,
        email: respauth.data.email,
        username: respauth.data.id,
      })
    }
  
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

// server.use('/', (req,res) => res.redirect('/client'))

export default context;
