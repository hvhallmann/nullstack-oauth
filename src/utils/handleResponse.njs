/**
 * Handle response.
 */
export const handleResponse = (req, res, response) => {
  if (response.status === 302) {
    var location = response.headers.location;
    delete response.headers.location;
    res.set(response.headers);
    res.redirect(location);
  } else {
    res.set(response.headers);
    res.status(response.status).send(response.body);
  }
}
