/**
 * JCDF Scraper
 *
 * @description Scraper for junta comercial of Distrito Federal
 *              http://jcdf.smpe.gov.br
 *
 * approved - http://siarco.jcdf.smpe.gov.br/protocolo/processo.php?nrproc=150736177
 * rejected - http://siarco.jcdf.smpe.gov.br/protocolo/processo.php?nrproc=150736177
 * waiting - http://siarco.jcdf.smpe.gov.br/protocolo/processo.php?nrproc=150736177
 */

var
  response = require('./base'),
  request = require('request'),
  cheerio = require('cheerio'),
  Promise = require('bluebird');

Promise.promisifyAll(request);

module.exports = {
  scrap: function(processNumber) {

    var url = 'http://siarco.jcdf.smpe.gov.br/protocolo/processo.php?nrproc=' + processNumber;

    // request for the html
    var getP = request.getAsync(url);

    // scrap the status text
    return getP.then(function (result) {

      var status = result[0].body.toLowerCase();

      if (status.indexOf('aprovado') >= 0) {
        return response.approved(processNumber, url);
      } else if (status.indexOf('em tramitacao') >= 0) {
        return response.waiting(processNumber, url);
      } else if (status.indexOf('em exig') >= 0) {
        return response.rejected(processNumber, url);
      }

      return response.notFound(processNumber, url);
    });

  }
};
