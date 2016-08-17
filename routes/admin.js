module.exports = function() {
  var express = require('express'),
      app = express();

  app.get('/', function(request, response) {
    response.send('Admin');
  })
  .post('/', function(request, response) {
    response.send('post');
  });

  return app;
}();
