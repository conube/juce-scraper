/**
 * JUCERJA Scraper
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

    var url = 'https://www.jucerja.rj.gov.br/Servicos/AndamentoProc/?protocolo='+processNumber;

    // request for the html
    var getP = request.getAsync(url);

    // scrap the status text
    var getStatusP = getP.then(function (result) {

      $ = cheerio.load(result[0].body);

      return {
          first: $("table tr:nth-child(6) td:last-child").text().toLowerCase(),
          second: $("table tr:nth-child(7) td:last-child").text().toLowerCase()
      };

    });

    // send response
    return getStatusP.then(function (status) {

      if (status.second.indexOf('deferido') >= 0) {
        return response.approved(processNumber, url);
      } else if (status.second.indexOf('exig') >= 0) {
        return response.rejected(processNumber, url);
      } else if (status.first.indexOf('aguarde') >= 0) {
        return response.waiting(processNumber, url);
      }

      return response.notFound(processNumber, url);

    });
  }
};
