import OAuth2Server from 'oauth2-server'

import { handleError } from '../../utils/handleError.njs'
import { handleResponse } from '../../utils/handleResponse.njs'

export default [
  async(req, res, next) => {
    if (req.me._id) {
      req.body.user = req.me
      return next()
    }

    const params = [ // Send params back down
        'client_id',
        'redirect_uri',
        'response_type',
        'grant_type',
        'state',
      ]
      .map(a => `${a}=${req.body[a]}`)
      .join('&')
    return res.redirect(`/oauth?success=false&${params}`)
  },
  async (req, res, next) => {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);

    try {
      const code = await req.oauth.authorize(request, response, {
        authenticateHandler: {
          handle: req => {
            console.log('Authenticate Handler')
            console.log(Object.keys(req.body).map(k => ({
              name: k,
              value: req.body[k]
            })))
            return req.body.user
          }
        }
      })
      res.locals.oauth = {
        code: code
      };

      return handleResponse(req, res, response)
    } catch (err) {
      return handleError(err, req, res, response, next)
    }

  }
]