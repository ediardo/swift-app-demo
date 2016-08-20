module.exports = function() {
  var express = require('express'),
      app = express(),
      sqlite3 = require('sqlite3').verbose(),
      db = new sqlite3.Database('demo.db'),
      bodyParser = require('body-parser'),
      fs = require('fs');

  app.use(bodyParser.json()), // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/', function(request, response) {
    query = "SELECT \
              images.*, \
              categories.name AS category_name, \
              storage_backends.name AS storage_backend_name \
            FROM images \
            JOIN categories ON categories.id = images.category_id \
            JOIN storage_backends ON storage_backends.id  = images.storage_backend_id";

    db.all(query, function(error, rows) {
      response.render('admin', {images: rows});
    });
  });

  app.post('/', function(request, response) {
    var query = '',
        params = {};
        
    if (request.body.imageId) {
      var imageId = request.body.imageId;
      query = "SELECT images.*, categories.name AS category_name FROM images JOIN categories ON categories.id = images.category_id  WHERE images.id = $imageId ";
      params = {$imageId: request.body.imageId};
      db.get(query, params, function(error, row) {
        if (row) {
          db.run('DELETE FROM images WHERE id = ?', [imageId]);
          fs.unlink('./' + row.path + '/' + row.file_name);
          response.redirect('admin');
        }
      });
    } else if (request.body.panic) {
      query = "SELECT * FROM images";
      db.each(query, function(error, row) {
        if (row) {
          db.run('DELETE FROM images');
          fs.unlink('./' + row.path + '/' + row.file_name);
          response.redirect('admin');
        }
      });
    }

  });

  return app;
}();
