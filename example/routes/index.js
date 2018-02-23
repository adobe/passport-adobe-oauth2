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

/*
 * GET home page.
 */

/*exports.index = function(req, res){
 res.render('index', { title: 'Express' });
 };*/

module.exports = {
    '/': {
        fn: function (req, res) {
            if ( ! req.isAuthenticated() ) {
                res.render('index', { title: 'Login to Adobe'});
            }
            else {
                res.render('welcome', { title: 'Welcome to Adobe', user: req.user });
            }
	    }
    },
    '/private': {
        fn: function (req, res) {
            if ( ! req.isAuthenticated() ) {
                req.session.redirect_uri = '/?redirected_from_private';
                res.redirect('/auth/adobe/login.html');
                return;
            }
            res.redirect('/');
        }

    }
}
