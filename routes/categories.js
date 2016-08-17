module.exports = function() {
  var express = require('express'),
      app = express();

  app.get('/', function(request, response) {
    response.send('asdasda');
  })
  .post('/', function(request, response) {
    response.send('post');
  });

  return app;
}();
