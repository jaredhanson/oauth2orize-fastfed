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
  };
};
