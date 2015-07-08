/**
 * Base scraper module
 *
 * @description Base functions to build a scraper
 *
 */

 module.exports = {

  response: function(status, processNumber, url) {
    var m = {
      processNumber: processNumber,
      status: status
    };

    if (url !== undefined) {
      m.url = url;
    }

    return m;
  },

  approved: function(processNumber, url) {
    return this.response('approved', processNumber, url);
  },

  rejected: function(processNumber, url) {
    return this.response('rejected', processNumber, url);
  },

  waiting: function(processNumber, url) {
    return this.response('waiting', processNumber, url);
  },

  notFound: function(processNumber, url) {
    return this.response('not_found', processNumber, url);
  }

};
