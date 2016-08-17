module.exports = function() {
  var express = require('express'),
      app = express(),
      sqlite3 = require('sqlite3').verbose(),
      db = new sqlite3.Database('demo.db');

  app.get('/:imageId', function(request, response) {
    var imageId = request.params.imageId,
        query = '',
        params = {};

    query = "SELECT images.*, categories.name AS category_name FROM images JOIN categories ON categories.id = images.category_id  WHERE images.id = ? ";
    params = [imageId];


    db.get(query, params, function(error, row) {
      if (error) {
        console.error(error);
      }
      if (row == 0) {
        console.error('Could not find image with ID ' + imageId);
        response.status(404).send('error');
      }
      console.log(row);
      response.render('image', {image: row});
    });


  })

  return app;
}();
