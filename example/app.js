/**
   Copyright (c) 2014 - present Adobe Systems Incorporated. All rights reserved.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

   See the License for the specific language governing permissions and
   limitations under the License.
*/

/**
 * Module dependencies.
 */
var fs = require('fs');
var express = require('express');
var routescan = require('express-routescan');
passport = require('passport');

// this is our passport strategy, which in this example 'happens' to be in the 
// parent folder. Normally, this would look like `require('passport-adobe-oauth2')`
var AdobeStrategy = require('..').Strategy;
var routes = require('./routes');
var https = require('https');
var path = require('path');

var https_options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt'),
    requestCert: false,
    rejectUnauthorized: false
};

// You should modify the following values to match your own application
var ADOBE_STRATEGY_CONFIG = {
    clientID: "f802124f3bd54f0b860183b0a245b4c8",
    clientSecret: "51215294-7899-4e8f-9182-c4d5223f3e73",
    callbackURL: "https://localhost.corp.adobe.com:3000/auth/adobe/callback"
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

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Adobe profile is
//   serialized and deserialized.
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

var app = express();

// trust X-Forwarded-* headers
app.enable('trust proxy');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon(__dirname + '/public/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('secret'));
app.use(express.session());

/*
note: for persistent sessions you can use Redis
app.use(express.session({
  store: new RedisStore({
    host: 'localhost',
    port: 6379,
    db: 2,
    pass: 'RedisPASS'
  }),
  secret: '1234567890QWERTY'
}));
 */

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


// start express-routescan.
routescan(app);

https.createServer(https_options, app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
