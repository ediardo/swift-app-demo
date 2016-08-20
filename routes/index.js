module.exports = function() {
  var express = require('express'),
      app = express(),
      sqlite3 = require('sqlite3').verbose(),
      db = new sqlite3.Database('demo.db');

  app.get('/', function(request, response, next) {
    var query = '',
        params = {};
    query = "SELECT * FROM images WHERE category_id IN ($category_id) ORDER BY created_at DESC";
    if (request.query.filter == 'gif') {
      params = {$category_id: 1};
    } else if (request.query.filter == 'static') {
      params = {$category_id: 2};
    } else {
      query = "SELECT * FROM images WHERE category_id ORDER BY created_at DESC";
    }

    db.all(query, params, function(error, rows) {
      if (error) {

      } else {
        response.render('index', {images: rows});
      }
    });
  });

  return app;
}();
