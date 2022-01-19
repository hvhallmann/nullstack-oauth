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

import Ajv from 'ajv';
const ajv = new Ajv()
import { tokens, refreshTokens } from '../src/schema/db.njs';


const validateToken = ajv.compile(tokens)
const validateRefreshToken = ajv.compile(refreshTokens)


export function generateModel(database) {  
  return {
    getClient: async function(clientId, clientSecret) {
      console.log('Getting Client... ', { clientId, clientSecret })
      const client = await database.collection('clients').findOne({ 
        clientId,
        ...(clientSecret ? {clientSecret} : null)
      });
      console.log('Client found: ', client)
      return client
    },

    saveAuthorizationCode: async (code, client, user) => {
      try {
        const { authorizationCode, expiresAt, redirectUri, scope } = code
        const { _id: ClientId } = client
        const { _id: UserId } = user

        const newAuthorizationCode = {
          authorizationCode,
          expiresAt,
          ClientId,
          UserId
        }
        await database.collection('authorizationTokens').insertOne(newAuthorizationCode)

        return {
          authorizationCode,
          expiresAt,
          redirectUri,
          scope,
          client,
          user
        }
      } catch (error) {
        console.log(error)
        return false;
      }
    },
    
    getAccessToken: async function(clientId, clientSecret) {
      return 'works!'
    },

    getAuthorizationCode: async function() {
      return 'works!'
    },

    getUser: async function() {
      return 'works!'
    },

    // ---
    
    saveToken: async function(token, client, user) {
      /* This is where you insert the token into the database */
      console.log('token', token)
      console.log('client', client)
      console.log('user', user)

      dbtoken = {
        accessToken: token.accessToken,
        expiresAt: token.accessTokenExpiresAt,
        scope: token.scope,
        clientId: client.id,
        userId: user.id,
      }
      refreshToken = {
        refreshToken: token.refreshToken,
        expiresAt: token.refreshTokenExpiresAt,
        scope: token.scope,
        clientId: client.id,
        userId: user.id
      }

      const validToken = validateToken(dbtoken)
      const validRefreshToken = validateRefreshToken(refreshToken)

      console.log(validToken && validRefreshToken && 'is valid' || 'not valid');

      if (!validToken) console.log(validateToken.errors) 
      if (!validRefreshToken) console.log(validateRefreshToken.errors) 

      const fns = [
        database.collection('tokens').insertOne({ dbtoken }),
        database.collection('refreshTokens').insertOne({ refreshToken }),
      ]
      const result = await Promise.all(fns).spread(function(accessToken, refreshToken) {
          return { accessToken, refreshToken }
        })
      console.log('Token insert: ', result)

      return dbtoken
    },

    revokeToken: async (token) => {
      /* Delete the token from the database */
      log({
        title: 'Revoke Token',
        parameters: [
          { name: 'token', value: token },
        ]
      })
      console.log('revoke token', token)
      if (!token || token === 'undefined') return false
      return new Promise(resolve => resolve(true))
    },

  }
}