import Ajv from 'ajv';
const ajv = new Ajv()
import { tokens, refreshTokens } from '../src/schema/db.njs';
import { ObjectId } from 'mongodb'


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
      return {
        ...client,
        id: client._id.toString()
      }
    },

    getAuthorizationCode: async function(authorizationCode) {
      console.log('Getting Authorization Code ', authorizationCode)
      const code = await database.collection('authorizationTokens').findOne({ authorizationCode })

      const [findClient, findUser] = await Promise.all([
        await database.collection('clients').findOne({ _id: code.clientId }),
        await database.collection('users').findOne({ _id: code.userId })
      ])
      
      if(!code || !findClient || !findUser) return false

      return {
        code: code.authorizationCode,
        expiresAt: code.expiresAt,
        redirectUri: findClient.redirectUris[0],
        scope: code.scope,
        client: {
          ...findClient,
          id: findClient._id.toString()
        },
        user: {
          ...findUser,
          id: findUser._id.toString()
        },
      }
    },

    saveAuthorizationCode: async (code, client, user) => {
      try {

        const { authorizationCode, expiresAt, redirectUri, scope } = code
        const { _id: clientId } = client
        const { _id: userId } = user

        const newAuthorizationCode = {
          authorizationCode,
          expiresAt,
          redirectUri,
          scope,
          clientId,
          userId
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

    revokeAuthorizationCode: async function(authorizationCode) {
      console.log('Revoking Authorization Code ', authorizationCode)
      const { deletedCount  } = await database.collection('authorizationTokens').deleteOne({ authorizationCode: authorizationCode.code })
      return deletedCount === 1 
    },
    
    getAccessToken: async function(token) {
      if (!token || token === 'undefined') return false
      console.log('token', token)

      const dbToken = await database.collection('tokens').findOne({ 
        accessToken
      });

      return Promise.all([
        dbToken,
        database.collection('clients').findOne({clientId: ObjectId(dbToken.clientId)}),
        database.collection('users').findOne({_id: ObjectId(dbToken.userId)})
      ])
      .spread(function(tok, client, user) {
        return {
          accessToken: tok.access_token,
          accessTokenExpiresAt: tok.expires_at,
          scope: tok.scope,
          client: client, // with 'id' property
          user: user
        };
      });
    },

    saveToken: async function(token, client, user) {
      /* This is where you insert the token into the database */
      console.log('token', token)
      console.log('client', client)
      console.log('user', user)

      const dbtoken = {
        accessToken: token.accessToken,
        expiresAt: token.accessTokenExpiresAt,
        scope: token.scope,
        clientId: client.id,
        userId: user.id,
      }
      const refreshToken = {
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
      const [accessResult, refreshResult] = await Promise.all(fns)
      return { accessToken: dbtoken, refreshToken }
    },

    revokeToken: async (token) => {
      /* Delete the token from the database */
      console.log('revoke token', token)
      if (!token || token === 'undefined') return false

      const response = await database.collection('refreshTokens').deleteOne({ 
        refreshToken: token.refreshToken
      });

      return (response.deletedCount > 0) ? true : false
    },

    verifyScope: async (token, scope) => {
      /* This is where we check to make sure the client has access to this scope */
      console.log('scope', scope)
      if (!token || token === 'undefined') return false

      if (!token.scope) {
        return false;
      }
      let requestedScopes = scope.split(' ');
      let authorizedScopes = token.scope.split(' ');
      return requestedScopes.every(s => authorizedScopes.indexOf(s) >= 0);
    },

    // -- NOT MAIN FUNCTIONS ---

    getUser: async function(username, password) {
      const user = await database.collection('users').findOne({username, password})
      return (user) ? user : false
    },

    getUserFromClient: async function(client) {
      const user = await database.collection('users').findOne({_id: client.user_id})
      return (user) ? user : false
    },

  }
}