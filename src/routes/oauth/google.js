import jwt from 'jsonwebtoken'

const oauth2callback = async (req, res, database, oAuth2Client, secrets) => {
  try {
    const {
      code,
      scope
    } = req.query

    if (!code) {
      console.log('-- not code found --')
      const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
      });
      return res.redirect(authorizeUrl)
    }

    // Now that we have the code, use that to acquire tokens.
    const r = await oAuth2Client.getToken(code);
    // Make sure to set the credentials on the OAuth2 client.
    oAuth2Client.setCredentials(r.tokens);
    console.info('Tokens acquired.');

    const urlInfo = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json'
    const respauth = await oAuth2Client.request({
      url: urlInfo
    }); //can be scope from query

    if (!respauth.data.email) {
      console.error("user email not identified");
    }
 
    let user;
    
    user = await database.collection('users').findOne({email: respauth.data.email})
  
    if (!user) {
      user = {
        firstName: respauth.data.given_name,
        lastName: respauth.data.family_name,
        email: respauth.data.email,
        username: respauth.data.id,
      }
      const { insertedId } = context.database.collection('users').insertOne(user)
      Object.assign(user, { _id: insertedId })
    }

    req.session.token = jwt.sign(user._id.toString(), secrets.session);
    
    delete user.password;
    req.me = {...user, authMethod: 'google'}
  
    // After acquiring an access_token, you may want to check on the audience, expiration,
    // or original scopes requested.  You can do that with the `getTokenInfo` method.
    // const tokenInfo = await oAuth2Client.getTokenInfo(
    //   oAuth2Client.credentials.access_token
    // );
    // console.log('tokenInfo', tokenInfo);

    return res.redirect('/success')
  } catch (error) {
    console.error("Unexpected error", error);
    return res.redirect('/ops')
  }
};

export default oauth2callback;
