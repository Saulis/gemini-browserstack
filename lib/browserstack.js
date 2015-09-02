var _                  = require('lodash');
var cleankill          = require('cleankill');
var BrowserStackTunnel = require('browserstacktunnel-wrapper');

function BrowserStack() {
  var _tunnel;

  function stop(done) {
    console.log('Closing BrowserStack tunnel.');
    if(_tunnel) {
      _tunnel.stop(done);
    }
  };

  return {
    start: function(opts, done) {
      if(_tunnel) {
        throw Error('Tunnel already opened.');
      }

      var connectOptions = {
      };

      _.defaults(connectOptions, opts);

      var gridUrl = 'http://' + connectOptions.username + ':' + connectOptions.accessKey + '@hub.browserstack.com/wd/hub';

      _tunnel = new BrowserStackTunnel({
        key: connectOptions.accessKey,
        hosts: []
      });

      console.log('Opening BrowserStack tunnel.');
      _tunnel.start(function(error) {
        if(error) {
          done(error);
        } else {
          done(null, {gridUrl: gridUrl});
        }

        cleankill.onInterrupt(stop);
      });
    },

    stop: stop
  };
}

module.exports = BrowserStack;

