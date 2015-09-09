/**
 * JUCEMG Scraper
 *
 * @description Scraper for junta comercial of Minas Gerais
 *              http://www.jucemg.mg.gov.br
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
    var postP = request.postAsync({
      url: url,
      form: {
        numprotocolo: processNumber,
        continuar: '1',
        tokenConsultaProc: ''
      }
    });

    // scrap the status text
    var postStatusP = postP.then(function (result) {

      $ = cheerio.load(result[0].body);

      return ($('.situacao').text() || "") .toLowerCase().trim();

    });

    // send response
    return postStatusP.then(function (statusText) {

      if (statusText.indexOf('deferida') >= 0 || statusText.indexOf('aprovado') >= 0) {
        return response.approved(processNumber, url);
      } else if (statusText.indexOf('exig') >= 0) {
        return response.rejected(processNumber, url);
      } else if (statusText.indexOf('pendente') >= 0) {
        return response.waiting(processNumber, url);
      }

      return response.notFound(processNumber, url);

    });
  }
};
