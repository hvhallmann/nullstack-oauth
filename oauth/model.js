/* mongoose.model('OAuthTokens', new Schema({
  accessToken: { type: String },
  accessTokenExpiresOn: { type: Date },
  client : { type: Object },  // `client` and `user` are required in multiple places, for example `getAccessToken()`
  clientId: { type: String },
  refreshToken: { type: String },
  refreshTokenExpiresOn: { type: Date },
  user : { type: Object },
  userId: { type: String },
}));

mongoose.model('OAuthClients', new Schema({
  clientId: { type: String },
  clientSecret: { type: String },
  redirectUris: { type: Array }
}));

mongoose.model('OAuthUsers', new Schema({
  email: { type: String, default: '' },
  firstname: { type: String },
  lastname: { type: String },
  password: { type: String },
  username: { type: String }
})); */

export function generateModel(database) {  
  return {
    getClient: async function(clientId, clientSecret) {
      console.log('Getting Client... ', { clientId, clientSecret })
      // const client = await database.collection('clients').findOne({ clientId, clientSecret });
      const client = await database.collection('clients').findOne({ clientId });
      console.log('Client found: ', client)
      return client
    },

    saveAuthorizationCode: (code, client, user) => {
      console.log('Saving Authorization Code')
    },
    
    getAccessToken: async function(clientId, clientSecret) {
      return 'works!'
    },

    getAuthorizationCode: async function() {
      return 'works!'
    },

    getUser: async function() {
      return 'works!'
    }
  }
}