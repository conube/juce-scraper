/**
 * JUCEB Scraper
 *
 * @description Scraper for junta comercial of Bahia
 *              https://http://www.juceb.ba.gov.br/
 *
 * approved - 
 * rejected - 
 * waiting - http://www.juceb2.ba.gov.br/autoatendimento/auto/HistProcesso.asp?nrProc=158049233
 */

var
  response = require('./base'),
  request = require('request'),
  cheerio = require('cheerio'),
  Promise = require('bluebird');

Promise.promisifyAll(request);

module.exports = {
  scrap: function(processNumber) {

    var url = 'http://www.juceb2.ba.gov.br/autoatendimento/auto/HistProcesso.asp?nrProc=' + processNumber;

    // request for the html
    var getP = request.getAsync(url);

    // scrap the status text
    var getStatusP = getP.then(function (result) {
      $ = cheerio.load(result[0].body);

      return $('.tb-dados').parent().eq(4).children().next().text().toLowerCase().split('   ')[0];

    });

    // send response
    return getStatusP.then(function (status) {

      if (status.indexOf('aprovado') >= 0) {
        return response.approved(processNumber, url);
      } else if (status.indexOf('em tramitação') >= 0) {
        return response.waiting(processNumber, url);
      } else if (status.indexOf('em exigencia') >= 0) {
        return response.rejected(processNumber, url);
      }

      return response.notFound(processNumber, url);

    });
  }
};
