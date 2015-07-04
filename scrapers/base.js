module.exports = {

  response: function(status, processNumber, url) {
    return {
      processNumber: processNumber,
      status: status,
      url: url
    };
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
