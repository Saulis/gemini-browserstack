var _ = require('lodash');
var expect = require('chai').expect;
var mockery = require('mockery');
var sinon = require('sinon');


describe('plugin', function() {
  var plugin,
      gemini,
      q,
      deferred,
      browserstack;

  before(function() {
    q = sinon.spy();
    browserstack = sinon.spy();

    mockery.registerMock('q', q);
    mockery.registerMock('./browserstack', function() { return browserstack; });
  });

  beforeEach(function() {
    q.reset();
    browserstack.reset();

    gemini = sinon.spy();
    gemini.on = function(event, cb) {
      gemini[event] = cb;
    };

    gemini.config = {
      getBrowserIds: function () {
         return _.keys(gemini.config._browsers)
      },
      forBrowser: function (browserId) {
         return gemini.config._browsers[browserId]
      },
      _browsers: {}
    };

    deferred = sinon.spy();
    deferred.resolve = sinon.spy();
    deferred.reject = sinon.spy();

    q.defer = sinon.spy(function() {
      return deferred;
    });

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    });

    plugin = require('../lib/plugin');

    mockery.disable();
  });

  afterEach(function() {
    delete process.env.BS_USERNAME;
    delete process.env.BS_ACCESS_KEY;
  });

  it('should fail if credentials not provided', function() {
    expect(function() {
      plugin(gemini, {});
    }).to.throw(Error);
  });

  it  ('should read credentials from env', function() {
    process.env.BS_USERNAME = 'foo';
    process.env.BS_ACCESS_KEY = 'bar';

    var opts = {};
    plugin(gemini, opts);

    expect(opts.username).to.equal('foo');
    expect(opts.accessKey).to.equal('bar');
  });

  function init() {
    plugin(gemini, {username: 'foo', accessKey: 'bar'});
  };

  describe('on startRunner', function() {
    function startRunner() {
      return gemini['startRunner']();
    };

    beforeEach(function() {
      init();
      browserstack.start = sinon.spy();
    });

    it('should start browserstack tunnel', function() {
      startRunner();

      expect(browserstack.start.called).to.be.true;
    });

    it('should inject gridUrl to browsers', function() {
      gemini.config._browsers = {'chrome': {desiredCapabilities: {platform: 'Windows'}}};
      browserstack.start = function(opts, cb) {
        cb(null, {gridUrl: 'url'});
      };

      startRunner();

      expect(gemini.config._browsers.chrome.gridUrl).to.equal('url');
    });

    it('should inject local setting to browsers', function() {
      gemini.config._browsers = {'chrome': {desiredCapabilities: {platform: 'Windows'}}};
      browserstack.start = function(opts, cb) {
        cb(null, {});
      };

      startRunner();

      expect(gemini.config._browsers.chrome.desiredCapabilities['browserstack.local']).to.equal(true);
    });

    it('should return a promise', function() {
      deferred.promise = sinon.spy();

      expect(startRunner()).to.equal(deferred.promise);
    });

    it('should resolve the given promise', function() {
      browserstack.start = function(opts, cb) {
        cb(null, {});
      };

      startRunner();

      expect(deferred.resolve.called).to.be.true;
    });

    it('should reject on error', function() {
      browserstack.start = function(opts, cb) {
        cb('error', {});
      };

      startRunner();

      expect(deferred.reject.called).to.be.true;
    });
  });

  describe('on endRunner', function() {
    function endRunner() {
      return gemini['endRunner']();
    };

    beforeEach(function() {
      plugin(gemini, {username: 'foo', accessKey: 'bar'});
      browserstack.stop = sinon.spy();
    });

    it('should stop browserstack tunnel', function() {
      endRunner();

      expect(browserstack.stop.called).to.be.true;
    });

    it('should return a promise', function() {
      deferred.promise = sinon.stub();

      expect(endRunner()).to.equal(deferred.promise);
    });

    it('should resolve the given promise', function() {
      browserstack.stop = function(cb) {
        cb();
      }

      endRunner();

      expect(deferred.resolve.called).to.be.true;
    });
  });
});
