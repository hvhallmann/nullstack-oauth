import Nullstack from 'nullstack';
import bodyParser from 'body-parser';
import Application from './src/Application';

const oauthServer = require('./oauth/server.js')
const DebugControl = require('./utilities/debug.js')


const context = Nullstack.start(Application);

context.start = async function start() {
  // https://nullstack.app/application-startup
}


const { server } = context;

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use('/client', require('./routes/client.js')) // Client routes
server.use('/oauth', require('./routes/auth.js')) // routes to access the auth stuff


// Note that the next router uses middleware. That protects all routes within this middleware
server.use('/secure', (req,res,next) => {
  DebugControl.log.flow('Authentication')
  return next()
},oauthServer.authenticate(), require('./routes/secure.js')) // routes to access the protected stuff
server.use('/', (req,res) => res.redirect('/client'))

export default context;
