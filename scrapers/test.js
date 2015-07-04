var
  response = require('./base'),
  request = require('request'),
  cheerio = require('cheerio'),
  Promise = require('bluebird');

Promise.promisifyAll(request);

// flag for open ssl
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

for (i = 440000; i < 440999; i++) {
  var url = 'https://www.jucees.es.gov.br/consulta/processo.php?nrproc=14'+String("0000000" + i).slice(-7);

  // request for the html
  var getP = request.getAsync(url).then(function (result) {
    var status = result[0].body.toLowerCase();
    if (status.indexOf('aprovado') == -1 && status.indexOf('nao existe') == -1 && status.indexOf('em tramitacao')) {
      console.log(result[0].request.href);
    }
  });


}
