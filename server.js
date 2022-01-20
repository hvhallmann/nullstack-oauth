import Nullstack from 'nullstack';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import Application from './src/Application';

import OAuth2Server from 'oauth2-server'
import OAuthConfig from './src/config/oauth.njs'
import { generateModel } from './oauth/model'
import { handleResponse } from './src/utils/handleResponse.njs'
import { handleError } from './src/utils/handleError.njs'

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

const { server } = context;

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use('/client', require('./routes/client.js')) // Client routes
server.use('/oauth', require('./routes/auth.js')) // routes to access the auth stuff

server.post('/oauth/authorize', async (req, res, next) => {

  const { username, password } = req.body
  const user = await context.database.collection('users').findOne({ username, password })
  if(user) {
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

server.use('/', (req,res) => res.redirect('/client'))

export default context;
