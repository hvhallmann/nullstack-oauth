
export const clients = {
  type: 'object',
  properties: {
    clientId: { type: 'string' },
    clientSecret: { type: 'string' },
    redirectUris: { 
      type: 'array',
      items: { type: 'string '}
    },
    grants: { 
      type: 'array',
      items: { type: 'string '}
    },
  }
}

export const users = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    firstname: { type: 'string' },
    lastname: { type: 'string' },
    password: { type: 'string' },
    username: { type: 'string' },
  }
}

export const authorizationCode = {
  type: 'object',
  properties: {
    authorizationCode: { type: 'string' },
    expiresAt: { type: 'timestamp' },
    ClientId: { type: 'string' },
    UserId: { type: 'string' },
  }
}

export const tokens = {
  type: 'object',
  properties: {
    accessToken: { type: 'string' },
    accessTokenExpiresOn: { type: 'timestamp' },
    clientId: { type: 'string' },
    refreshToken: { type: 'string' },
    refreshTokenExpiresOn: { type: 'timestamp' },
    userId: { type: 'string' },
  }
}