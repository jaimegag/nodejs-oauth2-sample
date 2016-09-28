'use strict';

const express = require('express');
const simpleOauthModule = require('simple-oauth2');

const app = express();
const oauth2 = simpleOauthModule.create({
  client: {
    id: 'e3ca311d-999b-4e4f-b056-b50138cfff9f',
    secret: 'a995365e-d7b7-4727-95b8-463df2842f64',
  },
  auth: {
    tokenHost: 'https://sso1.login.run.haas-76.pez.pivotal.io',
    tokenPath: '/oauth/token',
    authorizePath: '/oauth/authorize',
  },
});

// Authorization uri definition
const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: 'https://nodejs-oauth2-sample.cfapps.haas-76.pez.pivotal.io/callback',
  scope: '',
  state: '3(#0/!~',
});

// Initial page redirecting to Github
app.get('/auth', (req, res) => {
  console.log(authorizationUri);
  res.redirect(authorizationUri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', (req, res) => {
  const code = req.query.code;
  console.log('code: ',code);
  const options = {
    code: code,
    redirect_uri: 'https://nodejs-oauth2-sample.cfapps.haas-76.pez.pivotal.io/callback',
  };
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  oauth2.authorizationCode.getToken(options, (error, result) => {
    if (error) {
      console.error('Access Token Error', error.message);
      return res.json('Authentication failed');
    }

    console.log('The resulting token: ', result);
    const token = oauth2.accessToken.create(result);

    return res
      .status(200)
      .json(token);
  });
});

app.get('/success', (req, res) => {
  res.send('');
});

app.get('/', (req, res) => {
  res.send('Hello<br><a href="/auth">Log in with Github</a>');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Express server started on port ',process.env.PORT || 3000); // eslint-disable-line
});


// Credits to [@lazybean](https://github.com/lazybean)
