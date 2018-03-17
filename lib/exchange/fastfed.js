var merge = require('utils-merge');
//var TokenError = require('../errors/tokenerror');


module.exports = function(options, issue) {
  if (typeof options == 'function') {
    issue = options;
    options = undefined;
  }
  options = options || {};
  
  if (!issue) { throw new TypeError('oauth2orize.tokenExchange exchange requires an issue callback'); }
  
  var userProperty = options.userProperty || 'user';
  
  
  return function(req, res, next) {
    if (!req.body) { return next(new Error('OAuth2orize requires body parsing. Did you forget to use body-parser middleware?')); }

    // The 'user' property of `req` holds the authenticated user.  In the case
    // of the token endpoint, the property will contain the OAuth 2.0 client.
    var client = req[userProperty]
      , code = req.body.initial_access_code; // required

    function issued(err, accessToken, refreshToken, params) {
      if (err) { return next(err); }
      if (!accessToken) { return next(new TokenError('Invalid initial access code', 'invalid_grant')); }
      if (refreshToken && typeof refreshToken == 'object') {
        params = refreshToken;
        refreshToken = null;
      }
      
      var tok = {};
      tok.access_token = accessToken;
      if (refreshToken) { tok.refresh_token = refreshToken; }
      if (params) { utils.merge(tok, params); }
      tok.token_type = tok.token_type || 'Bearer';

      var json = JSON.stringify(tok);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Pragma', 'no-cache');
      res.end(json);
    }

    try {
      var arity = issue.length;
      if (arity == 5) {
        issue(client, code, req.body, req.authInfo, issued);
      } else if (arity == 4) {
        issue(client, code, req.body, issued);
      } else {
        issue(client, code, issued);
      }
    } catch (ex) {
      return next(ex);
    }
  };
};
