/**
 * Main server API application
 *
 *
 */

var
  url = require('url'),
  http = require('http'),
  fs = require('fs'),
  Promise = require('bluebird');

Promise.promisifyAll(fs);

var server = http.createServer(

  function(request, response) {

    if (request.method == 'GET'
        && request.url !== '/'
        && request.url !== '/favicon.ico') {

      var path = url.parse(request.url, true).pathname;
      var parts = path.substring(1, path.length).split('/');

      var scrapperName = parts[0];
      var firstParam = parts[1];

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

      }).catch(function() {
        // scraper module not found
        notFoundResponse(response);
      });

    } else {
      notFoundResponse(response);
    }
  }

);

var notFoundResponse = function(response) {
  response.writeHead(404);
  response.end();
};

var jsonResponse = function(response, data) {
  response.writeHead(200, {
    'Content-Type': 'application/json'
  });

  response.write(JSON.stringify(data));
  response.end();
};

server.listen(process.env.PORT || 9080);
