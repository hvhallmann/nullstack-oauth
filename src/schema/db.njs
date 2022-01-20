
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
    expiresAt: { type: 'string' },
    redirectUri: { type: 'string' },
    scope: { type: 'string' },
    clientId: { type: 'string' },
    userId: { type: 'string' },
  }
}

export const tokens = {
  type: 'object',
  properties: {
    accessToken: { type: 'string' },
    expiresAt: { type: 'string' },
    clientId: { type: 'string' },
    scope: { type: 'string' },
    userId: { type: 'string' },
  }
}

export const refreshTokens = {
  type: 'object',
  properties: {
    refreshToken: { type: 'string' },
    expiresAt: { type: 'string' },
    clientId: { type: 'string' },
    scope: { type: 'string' },
    userId: { type: 'string' },
  }
}
