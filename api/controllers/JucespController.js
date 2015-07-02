/**
 * JucespciespController
 *
 * @description :: Server-side logic for managing jucespciesps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('request');
var cheerio = require('cheerio');

module.exports = {
	scrap: function(req, res) {

		req.body = req.body || {};
		req.body.process_number = req.body.process_number || req.query.p || req.params.id || "0543484154";

		var process_number = req.body.process_number;
		var number = process_number.substring(0, process_number.length -3);
		var year = process_number.substring(process_number.length-3, process_number.length -1);
		var digit = process_number.substring(process_number.length-1, process_number.length);


		var model = {
			process_number: process_number,
			number: number,
			process_year: year,
			process_digit: digit,
			length: process_number.length
		};

		request.get('https://www.jucesp.sp.gov.br/eprotocolo2.asp?numero='+number+'&ano='+year+'&digito='+digit, function(err, result){
			$ = cheerio.load(result.body);
			var statusText = $("#resposta tr:last-child td:first-child").text().toLowerCase();
			console.log('statusText', statusText, statusText.length, statusText === '', statusText === ' ', statusText === '&nbsp', statusText === " ");

			model.content = statusText;
			model.test = ('https://www.jucesp.sp.gov.br/eprotocolo2.asp?numero='+number+'&ano='+year+'&digito='+digit);

			if (statusText.indexOf('deferido') >= 0) {
				model.status = 'approved';
				// https://www.jucesp.sp.gov.br/eprotocolo2.asp?numero=0536492&ano=15&digito=3
			}
			else if (statusText.indexOf('exigencia') >= 0) {
				model.status = 'rejected';
				// https://www.jucesp.sp.gov.br/eprotocolo2.asp?numero=0540885&ano=15&digito=0
			}
			else if (statusText.length === 1) {
				model.status = 'empty';
				// https://www.jucesp.sp.gov.br/eprotocolo2.asp?numero=053534&ano=15&digito=3
			}
			else {
				model.status = 'not_found';
				// https://www.jucesp.sp.gov.br/eprotocolo2.asp?numero=0540889&ano=15&digito=0
			}
			
			res.json(model);
		});
	}
};