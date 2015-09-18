/**
 * JUCERGS Scraper
 *
 * @description Scraper for junta comercial of Rio Grande do Sul
 *              http://www.jucergs.rs.gov.br
 */

var
  response = require('./base'),
  request = require('request'),
  cheerio = require('cheerio'),
  Promise = require('bluebird');

Promise.promisifyAll(request);

module.exports = {
  scrap: function(processNumber) {

    var url = 'http://www.jucergs.rs.gov.br/p_servicos-andamento.asp';

    // request for POST
    var postP = request.postAsync({url:url, form:{op: '1', nProtocolo: processNumber}});

    // scrap the status text
    var postStatusP = postP.then(function (result) {

      $ = cheerio.load(result[0].body);

      return $('table:nth-of-type(2) tr:nth-child(1) td:last-of-type').text().toLowerCase();

    });

    // send response
    return postStatusP.then(function (statusText) {

      if (statusText.indexOf('aprovado') >= 0) {
        return response.approved(processNumber, url);
      } else if (statusText.indexOf('exigencia') >= 0) {
        return response.rejected(processNumber, url);
      } else if (statusText.indexOf('tramitacao') >= 0) {
        return response.waiting(processNumber, url);
      }

      return response.notFound(processNumber, url);

    });
  }
};
