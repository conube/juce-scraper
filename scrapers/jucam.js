/**
 * JUCPR Scraper
 *
 * @description Scraper for junta comercial of Parana
 *              https://www.empresasuperfacil.am.gov.br
 */

 // Need more protocols to run some tests

var
  response = require('./base'),
  request = require('request'),
  cheerio = require('cheerio'),
  Promise = require('bluebird');

Promise.promisifyAll(request);

module.exports = {
  scrap: function(processNumber) {

    // url of the request
    var url = 'https://www.empresasuperfacil.am.gov.br/sigfacil/processo/carrega-documentos/';

    // request for POST
    var postP = request.postAsync({
                  url:url,
                  headers:{
                    'content-type': 'application/json',
                    'accept-charset': 'utf-8',
                    'user-agent': 'Chrome/46.0'
                  },
                  json: true,
                  form: {
                    protocolo: processNumber,
                    perfil: '104306',
                    orgao: '1557',
                    orgaosEntidade: '1557,7389,7603,7602,7604,7660,7605,7606,7607,7608,7609,7610,7611,7612,7613,7614,7615,7616,7617,7618,7619,7620,7621,7622,7623,7624,7625,7626,7628,7629,7630,7632,7633,7634,7635,7636,7637,7638,7639,7640,7641,7642,7651,7652,7643,7645,7646,7648,7649,7650,7653,7654,7655,7656,7657,7658,7659,7661,7662,7663,7664,7665,7666,7667,7668,7647,7968,8408,9691'
                  }
                });

    // scrap the status text
    var postStatusP = postP.then(function (result) {

      console.log('teste', result[0].body.array);

      var array = result[0].body.array;

      if (array === undefined) {
        return 'not found';
      }
      else{
        for (var i = array.length - 1; i >= 0; i--) {

          if(array[i].status !== undefined){
            if (array[i].label === 'Ato Constitutivo' && array[i].status.enum === 1) {
              return 'approved';
            }
            else if (array[i].status.enum === 3 ) {
              return 'exigency';
            }
            else if (i === 0) {
              return 'waiting';
            }
          }
        }; 
      };
    });

    // send response
    return postStatusP.then(function (statusText) {

      if (statusText === 'approved') {
        return response.approved(processNumber, url);
      } else if (statusText === 'exigency') {
        return response.rejected(processNumber, url);
      } else if (statusText === 'waiting') {
        return response.waiting(processNumber, url);
      }

      return response.notFound(processNumber, url);

    });
  }
};
