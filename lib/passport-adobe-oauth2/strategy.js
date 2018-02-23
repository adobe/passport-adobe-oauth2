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
var util = require('util');
var PassportOAuth = require('passport-oauth');


/**
 * `Strategy` constructor.
 *
 * The Adobe authentication strategy authenticates requests by delegating to
 * Adobe using the OAuth 2.0 protocol.
 *
 * Applications must supply a `request_uri` callback which accepts an `access_token`,
 * `expires_in`, `token_type` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Adobe application's app key
 *   - `clientSecret`  your Adobe application's app secret
 *   - `callbackURL`   URL to which Adobe will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new AdobeStrategy({
 *         clientID: 'yourAppKey',
 *         clientSecret: 'yourAppSecret'
 *         callbackURL: 'https://www.example.net/auth/adobe-oauth2/callback',
 *         response_type: 'token'
 *       },
 *       function(access_token, expires_in, token_type, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
    var opts = options || {};
    opts.authorizationEndpoint = opts.authorizationEndpoint || 'https://ims-na1.adobelogin.com';
    opts.authorizationURL = opts.authorizationURL || opts.authorizationEndpoint + '/ims/authorize/v1';
    opts.tokenURL = opts.tokenURL || opts.authorizationEndpoint + '/ims/token/v1';
    opts.profileURL = opts.profileURL || opts.authorizationEndpoint + '/ims/profile/v1';
    opts.scopeSeparator = opts.scopeSeparator || ',';
    opts.customHeaders = opts.customHeaders || {};

    PassportOAuth.OAuth2Strategy.call(this, opts, verify);
    this.name = 'adobe';
    this._clientID = opts.clientID;
    this._profileURL = opts.profileURL;
}

/**
 * Inherit from `PassportOAuth.OAuth2Strategy`.
 */
util.inherits(Strategy, PassportOAuth.OAuth2Strategy);

Strategy.prototype.authorizationParams = function authorizationParams(/* options */) {
    var params = {};
    // params.response_type="token";
    return params;
};


/**
 * Retrieve user profile from Adobe.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `adobe`
 *   - `id`               the user's Adobe ID
 *   - `username`         the user's Adobe username
 *   - `displayName`      the user's full name
 *   - `profileUrl`       the URL of the profile for the user on Adobe
 *   - `emails`           the user's email addresses
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function (accessToken, done) {
    this._oauth2.get(this._profileURL + '?client_id=' + this._clientID +'&bearer_token=' + accessToken, accessToken,
        function (err, body /* , res */) {
            if (err) {
                return done(new PassportOAuth.InternalOAuthError('failed to fetch user profile', err));
            }

            try {
                var json = JSON.parse(body);

                var profile = { provider: 'adobe' };
                profile.id = json.userId;
                profile.displayName = json.displayName;
                profile.emails = [
                    { value: json.email }
                ];

                profile._raw = body;
                profile._json = json;

                done(null, profile);
            } catch (e) {
                done(e);
            }
        });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
