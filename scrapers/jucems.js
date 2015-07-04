/**
 * JUCEMS Scraper
 *
 * @description Scraper for junta comercial of Mato Grosso do Sul
 *              https://jucems.ms.gov.br
 */

var
  response = require('./base'),
  request = require('request'),
  cheerio = require('cheerio'),
  Promise = require('bluebird');

Promise.promisifyAll(request);

module.exports = {
  scrap: function(processNumber) {

    var url = 'https://servicos.jucems.ms.gov.br/scripts/consulta.exe/posicao?nrproc='+processNumber;

    // request for the html
    var getP = request.getAsync(url);

    // scrap the status text
    var getStatusP = getP.then(function (result) {

      var status = result[0].body.toLowerCase();

      if (status.indexOf('aprovado') >= 0) {
        return response.approved(processNumber, url);
      } else if (status.indexOf('o existe') >= 0) {
        return response.notFound(processNumber, url);
      } else if (status.indexOf('em tramitacao') >= 0) {
        return response.waiting(processNumber, url);
      } else {
        return response.rejected(processNumber, url);
      }

    });

  }
};
