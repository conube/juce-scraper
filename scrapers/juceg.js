/**
 * JUCEG Scraper
 *
 * @description Scraper for junta comercial of Goias
 *              http://servicos.juceg.go.gov.br/
 */

var
  response = require('./base'),
  request = require('request'),
  cheerio = require('cheerio'),
  Promise = require('bluebird');

Promise.promisifyAll(request);

module.exports = {
  scrap: function(processNumber) {

    var getUrl = 'http://servicos.juceg.go.gov.br/andamento-processo';

    // request for POST
    var getP = request.getAsync(getUrl);

    var getViewState = getP.then(function (result) {
      $ = cheerio.load(result[0].body);

      // console.log('test', result[0].body);

      var idLis = $('input');
      var id;

      for (var i = idLis.length - 1; i >= 0; i--) {
        if ($(idLis[i]).val().length >= 35) {
          id = $(idLis[i]).val()

          break;
        };

      };
    })

    // // split number to use on url
    // var number = processNumber.substring(2, processNumber.length - 1);
    // var year = processNumber.substring(0, 2);
    // var digit = processNumber.substring(processNumber.length - 1, processNumber.length);

    // var postUrl = 'http://servicos.juceg.go.gov.br/andamento-processo/interface/principal.xhtml';

    // // request for POST
    // var postP = request.postAsync({url:url, form:{nrProtocolo: year + '/' + number + '-' + digit, formPrincipal: 'formPrincipal', btnConsularProcesso: 'btnConsularProcesso' }});

    // // scrap the status text
    // var postStatusP = postP.then(function (result) {

    //   $ = cheerio.load(result[0].body);

    //   // console.log('result', $('.ui-datatable-even').text().toLowerCase())

    //   return $('.ui-datatable-even:last-of-type').text().toLowerCase();

    // });

    // // send response
    // return postStatusP.then(function (statusText) {

    //   if (statusText.indexOf('pronto') >= 0 || statusText.indexOf('arquivado') >= 0) {
    //     return response.approved(processNumber, url);
    //     // https://www.jucesp.sp.gov.br/eprotocolo2.asp?numero=0536492&ano=15&digito=3
    //   } else if (statusText.indexOf('exigencia') >= 0) {
    //     return response.rejected(processNumber, url);
    //     // https://www.jucesp.sp.gov.br/eprotocolo2.asp?numero=0540885&ano=15&digito=0
    //   } else if (statusText.length === 1) {
    //     return response.waiting(processNumber, url);
    //     // https://www.jucesp.sp.gov.br/eprotocolo2.asp?numero=053534&ano=15&digito=3
    //   }

    //   return response.notFound(processNumber, url);

    // });
  }
};
