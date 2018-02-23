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

## Example

The source repo contains a very basic example application you can run on your machine.
Here's how to get it up and running:

### Step 1: Create an integration on [Adobe Console](https://console.adobe.io/)
You need to set up OAuth web credentials for Creative SDK to use the sample. 
* Select "Web" for the platform
* For the default redirect URI:
	* `https://` +   some domain name +  `:3000` + `/auth/adobe/callback`
	* For example: `https://www.example.net:3000/auth/adobe/callback`
* Input a corresponding redirect URI pattern.
	* For example: `https://www\.example\.net/auth/adobe/callback`

### Step 2: Create a self-signed SSL certificate to run a local https server
Because we are only running this locally and in non-production mode, we can secure the server connection with a self-signed SSL cert. This can be done via openssl. 

Make sure the openssl library is installed by checking the path

	$ which openssl

Install if necessary: [MacOSX Homebrew](http://brewformulas.org/Openssl), [Windows](http://gnuwin32.sourceforge.net/packages/openssl.htm)

In the example directory, generate your cert and private key files: `server.key` and `server.crt`. The challenge password is used for certificate revocation-- you can leave this empty for the example

```bash
$ cd example
$ openssl genrsa -des3 -passout pass:x -out server.pass.key 2048
$ openssl rsa -passin pass:x -in server.pass.key -out server.key
writing RSA key
$ rm server.pass.key
$ openssl req -new -key server.key -out server.csr
You are about to be asked to enter information that will be incorporated
into your certificate request.
...
A challenge password []:
...
$ openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt
```

### Step 3: Override DNS records to redirect to local host
Open and edit the hosts file with admin rights.
* for MacOSX and Ubuntu: `sudo open /etc/hosts`
* for Windows (8, 8.1, 10): Run notepad as Administrator. File->Open `c:\windows\system32\drivers\etc\hosts`

Add a record on a new line to alias the redirect domain to your local host ip address

	127.0.0.1       www.example.net

### Step 4: Edit the app.js file in the example
Open and edit the example/app.js file. Fill the following variable to match the integration you created on the console 
	
	var ADOBE_CLIENT_ID = "..."
	var ADOBE_CLIENT_SECRET = "..."
	var REDIRECT_URI = "..."

### Step 5: Run the sample
Go into the `example` folder and run

    $ npm install
    $ npm start

Then open in your browser

    https://www.example.net:3000/auth/adobe/login.html

Replacing `www.example.net` with whatever redirect domain you chose. You may be prompted with an insecure website warning. Proceed anyway. 

## Tests

    $ npm test

## Credits

  - [Dragos Dascalita Haut] (http://github.com/ddragosd)

  This strategy is based on Jared Hanson's GitHub strategy for passport:  
  - [Jared Hanson](http://github.com/jaredhanson)

## License

[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0)

Copyright (c) 2014 - present Adobe Systems Incorporated. All rights reserved.

