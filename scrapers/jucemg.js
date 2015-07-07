/**
 * JUCEMG Scraper
 *
 * @description Scraper for junta comercial of Minas Gerais
 *              http://www.jucemg.mg.gov.br/
 */

var
  response = require('./base'),
  request = require('request'),
  cheerio = require('cheerio'),
  Promise = require('bluebird');

Promise.promisifyAll(request);

module.exports = {
  scrap: function(processNumber) {

    var url = 'http://www.jucemg.mg.gov.br/ibr/concprocessos';

    // request for POST
    var postP = request.postAsync({url:url, form:{numprotocolo: processNumber, continuar: '1', tokenConsultaProc: ''}});

    // scrap the status text
    var postStatusP = postP.then(function (result) {

      $ = cheerio.load(result[0].body);

      return $('.p_viab .situacao').text().toLowerCase();

    });

    // send response
    return postStatusP.then(function (statusText) {

      if (statusText.indexOf('deferida') >= 0) {
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
