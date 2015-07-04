/**
 * JUCESP Scraper
 *
 * @description Scraper for junta comercial of São Paulo
 *              https://www.jucesp.sp.gov.br
 */

var
  response = require('./base'),
  request = require('request'),
  cheerio = require('cheerio'),
  Promise = require('bluebird');

Promise.promisifyAll(request);

module.exports = {
  scrap: function(processNumber) {

    // split number to use on url
    var number = processNumber.substring(0, processNumber.length - 3);
    var year = processNumber.substring(processNumber.length - 3, processNumber.length - 1);
    var digit = processNumber.substring(processNumber.length - 1, processNumber.length);

    var url = 'https://www.jucesp.sp.gov.br/eprotocolo2.asp?numero=' + number + '&ano=' + year + '&digito=' + digit;

    // request for the html
    var getP = request.getAsync(url);

    // scrap the status text
    var getStatusP = getP.then(function (result) {

      $ = cheerio.load(result[0].body);

      return $('#resposta tr:last-child td:first-child').text().toLowerCase();

    });

    // send response
    return getStatusP.then(function (statusText) {

      if (statusText.indexOf('deferido') >= 0) {
        return response.approved(processNumber, url);
        // https://www.jucesp.sp.gov.br/eprotocolo2.asp?numero=0536492&ano=15&digito=3
      } else if (statusText.indexOf('exigencia') >= 0) {
        return response.rejected(processNumber, url);
        // https://www.jucesp.sp.gov.br/eprotocolo2.asp?numero=0540885&ano=15&digito=0
      } else if (statusText.length === 1) {
        return response.waiting(processNumber, url);
        // https://www.jucesp.sp.gov.br/eprotocolo2.asp?numero=053534&ano=15&digito=3
      }

      return response.notFound(processNumber, url);

    });
  }
};
