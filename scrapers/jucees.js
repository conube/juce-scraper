/**
 * JUCEES Scraper
 *
 * @description Scraper for junta comercial of Espirito Santo
 *              https://www.jucees.es.gov.br
 *
 * approved - https://www.jucees.es.gov.br/consulta/processo.php?nrproc=147802806
 * rejected - https://www.jucees.es.gov.br/consulta/processo.php?nrproc=140440879
 * waiting - https://www.jucees.es.gov.br/consulta/processo.php?nrproc=140031740
 */

var
  response = require('./base'),
  request = require('request'),
  cheerio = require('cheerio'),
  Promise = require('bluebird');

Promise.promisifyAll(request);

module.exports = {
  scrap: function(processNumber) {

    var url = 'https://www.jucees.es.gov.br/consulta/processo.php?nrproc=' + processNumber;

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
      } else if (status.indexOf('em tramitacao') >= 0) {
        return response.waiting(processNumber, url);
      } else if (status.indexOf('em exigencia') >= 0) {
        return response.rejected(processNumber, url);
      }

      return response.notFound(processNumber, url);

    });
  }
};
