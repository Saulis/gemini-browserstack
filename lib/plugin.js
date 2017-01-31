var _ = require('lodash');
var BrowserStack = require('./browserstack');
var Q = require('q');


function expandCredentials(opts) {
  if (!opts.username) {
    opts.username = process.env.BS_USERNAME;
  }
  if (!opts.accessKey) {
    opts.accessKey = process.env.BS_ACCESS_KEY;
  }
  if (!opts.username || !opts.accessKey) {
    throw Error('Missing BrowserStack credentials. Did you forget to set BS_USERNAME and/or BS_ACCESS_KEY?');
  }
}

module.exports = function(gemini, opts) {
  var browserStack = BrowserStack();

  expandCredentials(opts);

  gemini.on('startRunner', function(runner) {
    var deferred = Q.defer();

    browserStack.start(opts, function(err, config) {
      if(err) {
       deferred.reject(err);
      } else {
        _.forEach(gemini.config.getBrowserIds(), function(browserId) {
          var browser = gemini.config.forBrowser(browserId);
          browser.gridUrl = config.gridUrl;
          browser.desiredCapabilities['browserstack.local'] = true;
          if (opts.localIdentifier) {
            browser.desiredCapabilities['browserstack.localIdentifier'] = opts.localIdentifier;
          }
        });

        deferred.resolve();
      }
    });

    return deferred.promise;
  });

  gemini.on('endRunner', function(runner, data) {
    var deferred = Q.defer();

    browserStack.stop(function() {
      deferred.resolve();
    });

    return deferred.promise;
  });
};
