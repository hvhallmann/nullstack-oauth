
export const clients = {
  type: 'object',
  properties: {
    clientId: { type: 'object' },
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

export const authorizationTokens = {
  type: 'object',
  properties: {
    authorizationCode: { type: 'string' },
    expiresAt: {
      type: 'object',
      propertyNames: {
        format: "date-time"
      }
    },
    redirectUri: { type: 'string' },
    scope: { type: 'string' },
    clientId: { type: 'object' },
    userId: { type: 'object' },
  }
}

export const tokens = {
  type: 'object',
  properties: {
    accessToken: { type: 'string' },
    expiresAt: {
      type: 'object',
      propertyNames: {
        format: "date-time"
      }
    },
    clientId: { type: 'object' },
    scope: { type: 'string', "nullable": true },
    userId: { type: 'object' },
  }
}

export const refreshTokens = {
  type: 'object',
  properties: {
    refreshToken: { type: 'string' },
    expiresAt: {
      type: 'object',
      propertyNames: {
        format: "date-time"
      }
    },
    clientId: { type: 'object' },
    scope: { type: 'string', "nullable": true },
    userId: { type: 'object' },
  }
}
