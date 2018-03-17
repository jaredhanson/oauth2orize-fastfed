var chai = require('chai')
  , expect = require('chai').expect
  , fastfed = require('../../lib/exchange/fastfed');


describe('exchange.fastfed', function() {
  
  it('should be unnamed', function() {
    expect(fastfed(function(){}).name).to.equal('');
  });
  
  describe('issuing an access token', function() {
    var response, err;

    before(function(done) {
      function issue(client, code, done) {
        if (client.id !== '1') { return done(new Error('incorrect client argument')); }
        if (code !== 'PEFzc2VydGlvbiBJc3N1ZUluc3RhbnQ9IjIwMTEtMDUk2k2') { return done(new Error('incorrect code argument')); }
        
        return done(null, 'Lj2kj3ujwlkdnl2ip42i2o');
      }
      
      chai.connect.use(fastfed(issue))
        .req(function(req) {
          req.user = { id: '1' };
          req.body = {
            initial_access_code: 'PEFzc2VydGlvbiBJc3N1ZUluc3RhbnQ9IjIwMTEtMDUk2k2'
          };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .next(function(err) {
          throw err;
        })
        .dispatch();
    });
    
    it('should respond with headers', function() {
      expect(response.getHeader('Content-Type')).to.equal('application/json');
      expect(response.getHeader('Cache-Control')).to.equal('no-store');
      expect(response.getHeader('Pragma')).to.equal('no-cache');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal('{"access_token":"Lj2kj3ujwlkdnl2ip42i2o","token_type":"Bearer"}');
    });
  });
  
});
