/**
 * JucespciespController
 *
 * @description :: Server-side logic for managing jucespciesps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('request');
var cheerio = require('cheerio');

module.exports = {
	put: function(req, res) {

		req.body = req.body || {};
		req.body.process_number = req.body.process_number || "0543484154";

		var model = {
			process_number: req.body.process_number
		};

		request.get('http://www.jucespciesp.com.br/jucesp.asp?nprocesso='+model.process_number, function(err, result){
			$ = cheerio.load(result.body);
			var statusText = $("#jucesp").text().toLowerCase();

			if (statusText.indexOf('deferido')) {
				model.status = 'deferido';
			}

			res.json(model);
		});


	}
};
