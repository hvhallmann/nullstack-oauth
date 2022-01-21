import OAuth2Server from 'oauth2-server'

import { handleError } from '../../utils/handleError.njs'

export default [
  (req, res, next) => {
    console.log('Checking secured area')
    return next()
  },
  async (req, res, next) => {
    console.log('Checking secured area next middleware')
    const request = new OAuth2Server.Request(req)
    const response = new OAuth2Server.Response(res)

    try {
      const token = await req.oauth.authenticate(request, response, {})
      res.locals.oauth = {
        token: token
      };
      next();
    } catch (err) {
      return handleError(err, req, res, response, next)
    }
  },
  require('../../../routes/secure')
]