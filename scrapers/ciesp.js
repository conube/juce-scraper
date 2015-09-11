/**
 * CIESP Scraper
 *
 * @description Scraper for junta comercial of São Paulo inside of CIESP
 *              https://www.jucespciesp.com.br
 *
 */

var
  response = require('./base'),
  request = require('request'),
  cheerio = require('cheerio'),
  Promise = require('bluebird');

Promise.promisifyAll(request);

module.exports = {
  scrap: function(processNumber) {

    var url = 'http://www.jucespciesp.com.br/jucesp.asp?nprocesso=' + processNumber;

    // request html
    var getP =  request.getAsync(url);

    // scrap the status text on the htm
    var getStatusP = getP.then(function (result) {

      $ = cheerio.load(result[0].body);

      return $('#jucesp').text().toLowerCase();

    });

    // send response
    return getStatusP.then(function (statusText) {

      if (statusText.indexOf('deferido') > 0) {
        return response.approved(processNumber, url);
      } else if (statusText.indexOf('com exig') > 0) {
        return response.rejected(processNumber, url);
      } else if (statusText.indexOf('em an') > 0) {
        return response.waiting(processNumber, url);
      }

      return response.notFound(processNumber, url);

    });
  }
};
