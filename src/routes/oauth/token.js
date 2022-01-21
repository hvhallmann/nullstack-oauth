import OAuth2Server from 'oauth2-server'

import { handleError } from '../../utils/handleError.njs'
import { handleResponse } from '../../utils/handleResponse.njs'

export default [
  async (req, res, next) => {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);
    try {
      const token = await req.oauth.token(request, response, {
        requireClientAuthentication: { // whether client needs to provide client_secret
          // 'authorization_code': false,
        },
      });
      res.locals.oauth = {
        token: token
      };
      return handleResponse(req, res, response)
    } catch (err) {
      return handleError(err, req, res, response, next)
    }

  }
]