/**
 * JUCESE Scraper
 *
 * @description Scraper for junta comercial of Sergipe
 *              https://www.jucese.se.gov.br
 *
 * approved - http://sistemas.jucese.se.gov.br/cgi-bin/consulta.exe/posicao?nrproc=120281201
 * rejected - http://sistemas.jucese.se.gov.br/cgi-bin/consulta.exe/posicao?nrproc=120280078
 * waiting - http://sistemas.jucese.se.gov.br/cgi-bin/consulta.exe/posicao?nrproc=120281031
 */

var
  response = require('./base'),
  request = require('request'),
  cheerio = require('cheerio'),
  Promise = require('bluebird');

Promise.promisifyAll(request);

module.exports = {
  scrap: function(processNumber) {

    var url = 'http://sistemas.jucese.se.gov.br/cgi-bin/consulta.exe/posicao?nrproc=' + processNumber;

    // request for the html
    var getP = request.getAsync(url);

    // scrap the status text
    return getP.then(function (result) {

      var status = result[0].body.toLowerCase();

      if (status.indexOf('aprovado') >= 0) {
        return response.approved(processNumber, url);
      } else if (status.indexOf('em tramitacao') >= 0 || status.indexOf('digitado') >= 0) {
        return response.waiting(processNumber, url);
      } else if (status.indexOf('em exig') >= 0) {
        return response.rejected(processNumber, url);
      }

      return response.notFound(processNumber, url);

    });
  }
};
