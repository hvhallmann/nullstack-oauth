import UnauthorizedRequestError from 'oauth2-server/lib/errors/unauthorized-request-error';

/**
 * Handle errors.
 */
export const handleError = (e, req, res, response, next) => {
    if (response) {
      res.set(response.headers)
    }

    res.status(e.code)

    if (e instanceof UnauthorizedRequestError) {
      return res.send()
    }

    res.send({ error: e.name, error_description: e.message })
}
