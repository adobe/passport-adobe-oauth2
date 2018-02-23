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

var AdobeStrategy = require('../lib/passport-adobe-oauth2').Strategy;
var strategy;
var assert  = require('assert');

describe('oauth 2 passport AdobeStrategy', function() {
   it('should create instance', function() {
      strategy = new AdobeStrategy({
           clientID: '1212121212',
           clientSecret: '23232323232',
           callbackURL: 'localhost',
           response_type: 'token'
         },
         function () { return; });
   });

   it('should contain correct name', function() {
      assert.equal(strategy.name, 'adobe');
   });

   it('should contain correct clientID', function() {
      assert.equal(strategy._clientID, '1212121212');
   });

   it('should contain correct profileURL', function() {
      assert.equal(strategy._profileURL, 'https://ims-na1.adobelogin.com/ims/profile/v1');
   });

   it('should contain key', function() {
      assert.equal(strategy._key, 'oauth2:ims-na1.adobelogin.com');
   });

   it('should contain accessTokenName', function() {
      assert.equal(strategy._oauth2._accessTokenName, 'access_token');
   });

   it('should contain authorizeUrl', function() {
      assert.equal(strategy._oauth2._authorizeUrl, 'https://ims-na1.adobelogin.com/ims/authorize/v1');
   });

   it('should contain accessTokenUrl', function() {
      assert.equal(strategy._oauth2._accessTokenUrl, 'https://ims-na1.adobelogin.com/ims/token/v1');
   });
});

describe('when calling authenticate', function() {
   it('should throw error if user profile not fetched', function(done) {
      strategy = new AdobeStrategy({
           clientID: '1212121212',
           clientSecret: '23232323232',
           callbackURL: 'localhost',
           response_type: 'token'
         },
         function () { return; });

      strategy.userProfile('10101101010', function(err, data){
         expect(err.toString()).toEqual(jasmine.stringMatching('failed to fetch user profile'));
         done();
      });
   });
});
