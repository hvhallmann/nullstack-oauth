import Ajv from 'ajv';
import addFormats from "ajv-formats";
import {
  tokens,
  refreshTokens,
  authorizationTokens
} from '../src/schema/db.njs';
import {
  ObjectId
} from 'mongodb'

const ajv = new Ajv()
addFormats(ajv)

const validateToken = ajv.compile(tokens)
const validateRefreshToken = ajv.compile(refreshTokens)
const validateAuthTokens = ajv.compile(authorizationTokens)


export function generateModel(database) {
  return {
    getClient: async function (clientId, clientSecret) {
      console.log('Getting Client... ')
      const client = await database.collection('clients').findOne({
        clientId,
        ...(clientSecret ? {
          clientSecret
        } : null)
      });
      return {
        ...client,
        id: client._id.toString()
      }
    },

    getAuthorizationCode: async function (authorizationCode) {
      console.log('Getting Authorization Code ')
      const findAuthorizationCode = await database.collection('authorizationTokens').findOne({
        authorizationCode
      })

      if (!findAuthorizationCode) {
        console.error('Authorization code not found')
        return false
      }

      const [code, findClient, findUser] = await Promise.all([
        findAuthorizationCode,
        await database.collection('clients').findOne({
          _id: findAuthorizationCode.clientId
        }),
        await database.collection('users').findOne({
          _id: findAuthorizationCode.userId
        })
      ])

      if (!code || !findClient || !findUser) return false

      return {
        code: code.authorizationCode,
        expiresAt: code.expiresAt,
        redirectUri: code.redirectUri,
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

        const {
          authorizationCode,
          expiresAt,
          redirectUri,
          scope
        } = code
        const {
          _id: clientId
        } = client
        const {
          _id: userId
        } = user

        await database.collection('authorizationTokens').deleteMany({
          clientId,
          userId
        })

        const newAuthorizationCode = {
          authorizationCode,
          expiresAt,
          redirectUri,
          scope,
          clientId,
          userId
        }

        const validAuthToken = validateAuthTokens(newAuthorizationCode)
        if (!validAuthToken) console.error('Authorization Token not valid', validateAuthTokens.errors)

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

    revokeAuthorizationCode: async function (authorizationCode) {
      console.log('Revoking Authorization Code ')
      const {
        deletedCount
      } = await database.collection('authorizationTokens').deleteOne({
        authorizationCode: authorizationCode.code
      })
      return deletedCount === 1
    },

    getAccessToken: async function (token) {
      if (!token || token === 'undefined') return false

      const dbToken = await database.collection('tokens').findOne({
        accessToken: token
      });

      const [findToken, findClient, findUser] = await Promise.all([
        dbToken,
        database.collection('clients').findOne({
          _id: ObjectId(dbToken.clientId)
        }),
        database.collection('users').findOne({
          _id: ObjectId(dbToken.userId)
        })
      ])

      return {
        accessToken: findToken.accessToken,
        accessTokenExpiresAt: findToken.expiresAt,
        scope: findToken.scope,
        client: {
          id: findClient._id.toString(),
          ...findClient
        },
        user: {
          id: findUser._id.toString(),
          ...findUser
        },
      }
    },

    getRefreshToken: async function (refreshToken) {
      if (!refreshToken || refreshToken === 'undefined') return false

      const dbToken = await database.collection('refreshTokens').findOne({
        refreshToken
      });

      const [findToken, findClient, findUser] = await Promise.all([
        dbToken,
        database.collection('clients').findOne({
          _id: ObjectId(dbToken.clientId)
        }),
        database.collection('users').findOne({
          _id: ObjectId(dbToken.userId)
        })
      ])

      if (!findToken || !findClient) return false

      return {
        refreshToken: findToken.refreshToken,
        refreshTokenExpiresAt: findToken.expiresAt,
        scope: findToken.scope,
        client: {
          ...findClient,
          id: findClient._id.toString()
        },
        user: {
          ...findUser,
          id: findUser._id.toString()
        }
      };
    },

    saveToken: async function (token, client, user) {
      /* This is where you insert the token into the database */
      const dbtoken = {
        accessToken: token.accessToken,
        expiresAt: token.accessTokenExpiresAt,
        scope: token.scope,
        clientId: client._id,
        userId: user._id,
      }
      const refreshToken = {
        refreshToken: token.refreshToken,
        expiresAt: token.refreshTokenExpiresAt,
        scope: token.scope,
        clientId: client._id,
        userId: user._id
      }
      const validToken = validateToken(dbtoken)
      const validRefreshToken = validateRefreshToken(refreshToken)

      if (!validToken) console.error('token not valid', validateToken.errors)
      if (!validRefreshToken) console.error('refresh not valid', validateRefreshToken.errors)

      const fns = [
        database.collection('tokens').insertOne({
          ...dbtoken
        }),
        database.collection('refreshTokens').insertOne({
          ...refreshToken
        }),
      ]
      const [accessResult, refreshResult] = await Promise.all(fns)
      const response = {
        accessToken: dbtoken.accessToken,
        accessTokenExpiresAt: dbtoken.expiresAt,
        refreshToken: refreshToken.refreshToken,
        refreshTokenExpiresAt: refreshToken.expiresAt,
        scope: dbtoken.scope,
        client: {
          id: dbtoken.clientId.toString()
        },
        user: {
          id: dbtoken.userId.toString()
        }
      }
      return response
    },

    revokeToken: async (token) => {
      /* Delete the token from the database */
      if (!token || token === 'undefined') return false

      const response = await database.collection('refreshTokens').deleteOne({
        refreshToken: token.refreshToken
      });

      return (response.deletedCount > 0) ? true : false
    },

    verifyScope: async (token, scope) => {
      /* This is where we check to make sure the client has access to this scope */
      if (!token || token === 'undefined') return false

      if (!token.scope) {
        return false;
      }
      let requestedScopes = scope.split(' ');
      let authorizedScopes = token.scope.split(' ');
      return requestedScopes.every(s => authorizedScopes.indexOf(s) >= 0);
    },

    // -- NOT MAIN FUNCTIONS ---

    getUser: async function (username, password) {
      const user = await database.collection('users').findOne({
        username,
        password
      })
      return (user) ? user : false
    },

    getUserFromClient: async function (client) {
      const user = await database.collection('users').findOne({
        _id: client.user_id
      })
      return (user) ? user : false
    },

  }
}