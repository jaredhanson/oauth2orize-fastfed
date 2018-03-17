/* global describe, it */

var pkg = require('..');
var expect = require('chai').expect;


describe('oauth2orize-fastfed', function() {
  
  it('should export exchanges', function() {
    expect(pkg.exchange).to.be.an('object');
    expect(pkg.exchange.fastfed).to.be.a('function');
  });
  
});
