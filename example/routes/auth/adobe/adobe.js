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

//var passport = require('passport')
module.exports = {
    '/auth/adobe/login.html': {
        middleware: [ passport.authenticate('adobe', { scope: ['openid', 'AdobeID', 'creative_sdk'], response_type: 'token' }) ],
        fn: function (req, res) {
            console.log("/auth/adobe/login.html opened");
        }
    },
    '/auth/adobe/logout.html': {
        fn: function (req, res) {
            console.log("/auth/adobe/logout.html opened");
            req.logout();
            res.redirect('/');
        }
    },
    '/auth/adobe/callback': {
        middleware: [ passport.authenticate('adobe', { failureRedirect: '/auth/adobe/login-failed.html' }) ],
        fn: function (req, res) {
            console.log("/auth/adobe/callback opened");
            res.redirect(req.session.redirect_uri || '/');
        }
    }
}
