/**
 * JUCEG Scraper
 *
 * @description Scraper for junta comercial of Goias
 *              http://servicos.juceg.go.gov.br/andamento-processo/
 */

var
  response = require('./base'),
  request = require('request'),
  cheerio = require('cheerio'),
  Promise = require('bluebird'),
  tough = require('tough-cookie');

Promise.promisifyAll(request);

module.exports = {
  scrap: function(processNumber) {

    // url for GET
    var getUrl = 'http://servicos.juceg.go.gov.br/andamento-processo';

    // url for POST
    var postUrl = 'http://servicos.juceg.go.gov.br/andamento-processo/interface/principal.xhtml';

    // split number to use on url
    var number = processNumber.substring(2, processNumber.length - 1);
    var year = processNumber.substring(0, 2);
    var digit = processNumber.substring(processNumber.length - 1, processNumber.length);

    // ID from 
    var id;

    // request for POST
    var getP = request.getAsync(getUrl);

    // get url to save the ID and cookie
    var getViewState = getP.then(function (result) {
      $ = cheerio.load(result[0].body);
      var fullCookie = result[0].headers['set-cookie'][0].split(';')[0];

      var idList = $('input');

      // set the ID
      for (var i = idList.length - 1; i >= 0; i--) {
        if ($(idList[i]).val().length >= 35) {
          id = $(idList[i]).val();
          break;
        }
      }
      return fullCookie;
    });

    // set the cookie
    var setCook = getViewState.then(function (fullCookie) {

      var j = request.jar();
      var cookie = request.cookie(fullCookie);
      j.setCookie(fullCookie, getUrl);

      return j;
    });

    // request for POST
    var postP = setCook.then(function (cookies) {
      return request.postAsync({
        url:postUrl, 
        form:{
          'javax.faces.partial.ajax': 'true',
          'javax.faces.source': 'btnConsularProcesso',
          'javax.faces.partial.execute': 'btnConsularProcesso nrProtocolo',
          'javax.faces.partial.render': 'formPrincipal formPrincipal pnBotoes mensagem',
          btnConsularProcesso: 'btnConsularProcesso',
          formPrincipal: 'formPrincipal',
          nrProtocolo: year + '/' + number + '-' + digit,
          'javax.faces.ViewState': id },
        jar: cookies
      });
    });
    

    // scrap the status text
    var postStatusP = postP.then(function (result) {

      $ = cheerio.load(result[0].body);

      return result[0].body.toLowerCase();

    });

    // send response
    return postStatusP.then(function (statusText) {

      if (statusText.indexOf('bt_aprovado') >= 0) {
        return response.approved(processNumber, getUrl);
        // https://www.jucesp.sp.gov.br/eprotocolo2.asp?numero=0536492&ano=15&digito=3
      } else if (statusText.indexOf('bt_exigencia') >= 0) {
        return response.rejected(processNumber, getUrl);
        // https://www.jucesp.sp.gov.br/eprotocolo2.asp?numero=0540885&ano=15&digito=0
      }else if (statusText.indexOf('bt_transporte_ida') >= 0) {
        return response.waiting(processNumber, getUrl);
        // https://www.jucesp.sp.gov.br/eprotocolo2.asp?numero=0540885&ano=15&digito=0
      } else if (statusText.length === 1) {
        return response.waiting(processNumber, getUrl);
        // https://www.jucesp.sp.gov.br/eprotocolo2.asp?numero=053534&ano=15&digito=3
      }

      return response.notFound(processNumber, getUrl);

    });
  }
};
