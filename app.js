/**
 * Main server API application
 *
 *
 */

var
  url     = require('url'),
  http    = require('http'),
  fs      = require('fs'),
  Promise = require('bluebird');

Promise.promisifyAll(fs);

var server = http.createServer(

  function(request, response) {

    // check if the request is GET
    if (request.method !== 'GET'
        || request.url === '/'
        || request.url === '/favicon.ico') {
          statusResponse(404, response);
          return;
    }

    // check if the request contains at least 2 parts to match the /{scraperName}/{protocolNumber}
    var path = url.parse(request.url, true).pathname;
    var parts = path.substring(1, path.length).split('/');

    if (parts.length < 2) {
      statusResponse(400, response);
      return;
    }

    var scrapperName = parts[0].toLowerCase(); // to avoid issues
    var firstParam = parts[1].toLowerCase();

    var modulePath = './scrapers/' + scrapperName + '.js';

    // try find scraper module based on the url
    var findModule = fs.statAsync(modulePath);

    findModule.then(function() {
      // load module
      var scraperModule = require(modulePath);

      // create promise for scrap
      var scraperPromise = scraperModule.scrap(firstParam);

      scraperPromise.then(function(data) {
        jsonResponse(response, data);
      });

    }).catch(function(err) {
      // scraper load module error
      console.error(scrapperName, 'load module error', err);

      statusResponse(400, response);
    });
  }

);

var statusResponse = function(status, response) {
  response.writeHead(status);
  response.end();
};

var jsonResponse = function(response, data) {
  response.writeHead(200, {
    'Content-Type': 'application/json'
  });
  response.write(JSON.stringify(data));
  response.end();
};

// flag for open ssl
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var port = process.env.PORT || 9080;
server.listen(port, function() {
  console.log('server started on port ' + port);
});
