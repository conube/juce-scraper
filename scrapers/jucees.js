/**
 * JUCEES Scraper
 *
 * https://www.jucesp.sp.gov.br/eprotocolo2.asp
 */

var
  response = require('./base'),
  request = require('request'),
  cheerio = require('cheerio'),
  Promise = require('bluebird');

Promise.promisifyAll(request);

module.exports = {
  scrap: function(processNumber) {

    var url = 'https://www.jucees.es.gov.br/consulta/processo.php?nrproc='+processNumber;

    // request for the html
    var getP = request.getAsync(url);

    // scrap the status text
    var getStatusP = getP.then(function (result) {

      return result[0].body.toLowerCase();

    });

    // send response
    return getStatusP.then(function (status) {

      if (status.indexOf('aprovado') >= 0) {
        return response.approved(processNumber, url);
      } else if (status.indexOf('nao existe') >= 0) {
        return response.notFound(processNumber, status);
      } else {
        return response.rejected(processNumber, url);
      }

      // TEMOS QUE PROGRAMAR
      //  else if (status.indexOf('aguarde') >= 0) {
      //   return response.waiting(processNumber, url);
      // }

    });
  }
};
