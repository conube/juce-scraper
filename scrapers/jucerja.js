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
        // https://www.jucesp.sp.gov.br/eprotocolo2.asp?numero=0536492&ano=15&digito=3
      } else if (status.second.indexOf('exig') >= 0) {
        return response.rejected(processNumber, url);
        // https://www.jucesp.sp.gov.br/eprotocolo2.asp?numero=0540885&ano=15&digito=0
      } else if (status.first.indexOf('aguarde') >= 0) {
        return response.waiting(processNumber, url);
        // https://www.jucesp.sp.gov.br/eprotocolo2.asp?numero=053534&ano=15&digito=3
      }

      return response.notFound(processNumber, url);

    });
  }
};
