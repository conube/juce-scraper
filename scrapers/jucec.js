/**
 * JUCEMG Scraper
 *
 * @description Scraper for junta comercial of Ceara
 *              http://vpn2.jucec.ce.gov.br
 */

var
  response = require('./base'),
  request = require('request'),
  cheerio = require('cheerio'),
  Promise = require('bluebird');

Promise.promisifyAll(request);

module.exports = {
  scrap: function(processNumber) {

    // url of the request
    var url = 'http://vpn2.jucec.ce.gov.br/cdp/cdpmostra.php';

    // split number to use on url
    var number = processNumber.substring(2, processNumber.length - 1);
    var year = processNumber.substring(0, 2);
    var digit = processNumber.substring(processNumber.length - 1, processNumber.length);

    // request for POST
    var postP = request.postAsync({url:url, form:{protocolo: year + '/' + number + '-' + digit, submit: 'Consultar'}});

    // scrap the status text
    var postStatusP = postP.then(function (result) {

      $ = cheerio.load(result[0].body);

      return $('table table tr:first-of-type').next().find('td:nth-child(2) font b').text().toLowerCase();

    });

    // send response
    return postStatusP.then(function (statusText) {

      if (statusText.indexOf('aprovado') >= 0) {
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
