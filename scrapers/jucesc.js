/**
 * JUCEES Scraper
 *
 * @description Scraper for junta comercial of Santa Catarina
 *              http://sistemas2.jucesc.sc.gov.br
 */

var
  response = require('./base'),
  request = require('request'),
  cheerio = require('cheerio'),
  Promise = require('bluebird');

Promise.promisifyAll(request);

module.exports = {
  scrap: function(processNumber) {

    var url = 'http://sistemas2.jucesc.sc.gov.br/requerimentos/acompanhamentoprocessogeral.aspx?' + processNumber;

    // request for the html
    var getP = request.getAsync(url);

    // scrap the status text
    var getStatusP = getP.then(function (result) {
      $ = cheerio.load(result[0].body);

      return $('#TABLE7 #TABLE1 tbody tr:nth-child(8) td #span_vSITUACAO').text().toLowerCase();

    });

    // send response
    return getStatusP.then(function (status) {

      if (status.indexOf('finalizado') >= 0) {
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
