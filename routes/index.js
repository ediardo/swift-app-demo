module.exports = function() {
  var express = require('express'),
      app = express(),
      sqlite3 = require('sqlite3').verbose(),
      db = new sqlite3.Database('demo.db');

  app.get('/', function(request, response, next) {
    var query = '',
        params = {};
    query = "SELECT * FROM images ORDER BY created_at DESC"
    db.all(query, function(error, rows) {
      if (error) {

      } else {
        response.render('index', {images: rows});
      }
    });
  });

  return app;
}();
