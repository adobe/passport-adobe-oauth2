# Passport-Adobe-OAuth2

[Passport](http://passportjs.org/) strategy for authenticating users with an AdobeId using the OAuth 2.0 API.

This module lets you authenticate using Adobe Identity Management Services (IMS) in your Node.js applications.
By plugging into Passport, AdobeId authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

[Adobe Authentication - Getting Started](https://www.adobe.io/apis/cloudplatform/console/authentication/gettingstarted.html)

## Install

    $ npm install passport-adobe-oauth2

## Usage

#### Create an integration on [Adobe Console](https://console.adobe.io/)
You need to set up OAuth web credentials for Creative SDK to use the sample. 
* Select "Web" for the platform
* For the default redirect URI:
	* `https://` +   some domain name +  `:3000` + `/auth/adobe/callback`
	* For example: `https://www.example.net:3000/auth/adobe/callback`
* Input a corresponding redirect URI pattern.
	* For example: `https://www\.example\.net/auth/adobe/callback`

#### Configure Strategy

The Adobe authentication strategy authenticates users using an Adobe ID account
and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which accepts
these credentials and calls `done` providing a user, as well as `options`
specifying a client ID, client secret, and callback URL.

```js
    // You should modify the following values to match your own application
    var ADOBE_STRATEGY_CONFIG = {
        clientID: "Insert Adobe Client ID Here",
        clientSecret: "Insert Adobe Client Secret Here",
        callbackURL: "https://www.example.net:3000/auth/adobe/callback"
    };

    // Use the AdobeStrategy within Passport.
    // Strategies in Passport require a `verify` function, which accepts credentials
    // (in this case, an accessToken, refreshToken, and Adobe profile)
    // and invoke a callback with a user object.
    passport.use(new AdobeStrategy(ADOBE_STRATEGY_CONFIG,
        function (accessToken, refreshToken, profile, done) {
            //verify function below
            // asynchronous verification, for effect...
            process.nextTick(function () {
                // To keep the example simple, the user's Adobe profile is returned to
                // represent the logged-in user.  In a typical application, you would want
                // to associate the Adobe account with a user record in your database,
                // and return that user instead.
                // var  userId = profile.userId || profile.sub;
                return done(null, profile);
            });
        }
    ));
```    

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'adobe'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
    app.get('/auth/adobe/login.html',
      passport.authenticate('adobe'));

    app.get('/auth/adobe/callback',
      passport.authenticate('adobe', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });
```

## Tests

    $ npm test

## Credits

  - Dragos Dascalita Haut [@ddragosd](https://github.com/ddragosd)
  - Audrey So [@audreyeso](https://github.com/audreyeso)
  - Caryn Tran [@carynbear](https://github.com/carynbear)
  - Jesse MacFadyen [@purplecabbage](https://github.com/purplecabbage)

  This strategy is based on Jared Hanson's GitHub strategy for passport:  
  - [Jared Hanson](https://github.com/jaredhanson)

## License

[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0)

Copyright (c) 2014 - present Adobe Systems Incorporated. All rights reserved.

