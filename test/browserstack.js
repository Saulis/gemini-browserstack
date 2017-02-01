var expect = require('chai').expect;
var mockery = require('mockery');
var sinon = require('sinon');

describe('browserstack', function() {
  var browserstack,
      wrapper,
      cleankill,
      tunnel;

  before(function() {
    cleankill = sinon.spy();
    tunnel = {};
    wrapper = sinon.spy(function() {
      return tunnel;
    });

    mockery.registerMock('cleankill', cleankill);
    mockery.registerMock('browserstacktunnel-wrapper', wrapper);
  });

  beforeEach(function() {
    wrapper.reset();
    cleankill.reset();

    tunnel.start = function(cb) { cb(); }

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    });

    browserstack = require('../lib/browserstack')();

    mockery.disable();
  });

  describe('start', function() {
    var opts,
        done;

    function start() {
      browserstack.start(opts, done);
    };

    beforeEach(function() {
      opts = {};
      done = sinon.spy();
      cleankill.onInterrupt = sinon.spy();
    });

    it('should throw error if tunnel already opened', function() {
      start();

      expect(function() { start(); }).to.throw(Error);
    });

    it('should callback with gridUrl.', function() {
      opts.username = 'foo';
      opts.accessKey = 'bar';

      start();

      expect(done.args[0][1].gridUrl).to.equal('http://foo:bar@hub.browserstack.com/wd/hub');
    });

    it('should set localIdentifier.', function() {
      opts.localIdentifier = 'abc123'

      start();

      expect(wrapper.alwaysCalledWithMatch({localIdentifier: 'abc123'})).to.be.true;
    });

    it('should enable cleankill on interrupt', function() {
      start();

      expect(cleankill.onInterrupt.called).to.be.true;
    });

    it('should return error on start', function() {
      tunnel.start = function(cb) { cb('error'); }

      start();

      expect(done.args[0][0]).to.equal('error');
    })
  });

  describe('stop', function() {
    var done;

    function stop() {
      browserstack.stop(done);
    };

    beforeEach(function() {
      done = sinon.spy();
      tunnel.stop = sinon.spy(function(cb) { cb(); });
    });

    it('should close the tunnel', function() {
      cleankill.onInterrupt = sinon.spy();
      browserstack.start({}, sinon.spy());

      stop();

      expect(tunnel.stop.called).to.be.true;
      expect(done.called).to.be.true;
    });
  });
});
