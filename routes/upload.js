module.exports = function() {
  var express = require('express'),
      app = express(),
      multer = require('multer'),
      pkgcloud = require('pkgcloud'),
      _ = require('lodash'),
      sqlite3 = require('sqlite3').verbose(),
      db = new sqlite3.Database('demo.db'),
      fs = require('fs'),
      imageSize = require('image-size'),
      crypto = require('crypto'),
      mime = require('mime');


  // create our client with your openstack credentials
  var client = pkgcloud.storage.createClient({
    provider: 'openstack',
    username: 'eddie.ramirez',

    region: 'RegionOne'
  });

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './tmp/uploads/')
    },
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
      });
    }
  });
  var upload = multer({storage: storage});

  app.get('/', function(request, response) {
    response.render('upload');
  })
  .post('/', upload.single('image'), function(request, response, next) {
    var data = {},
        original_name = request.file.originalname,
        display_name = request.body.display_name || request.file.originalname,
        size = request.file.size,
        mime_type = request.file.mimetype,
        file_name = request.file.filename,
        tmp_path = request.file.path,
        dimensions = {},
        category_id = null,
        backend_storage_id = null;

    category_id = (request.file.mimetype.includes('gif') ? 1 : 2);
    dimensions = imageSize(tmp_path);

    fs.rename(tmp_path, 'public/uploads/' + file_name);

    dimensions = imageSize(tmp_path);

    var query = "INSERT INTO images \
                  ( \
                    category_id, \
                    storage_backend_id, \
                    original_name, \
                    display_name, \
                    path, \
                    file_name, \
                    size, \
                    mime_type, \
                    width, \
                    height, \
                    created_at \
                  ) \
                  VALUES ( \
                    $category_id, \
                    $storage_backend_id, \
                    $original_name, \
                    $display_name, \
                    $path, \
                    $file_name, \
                    $size, \
                    $mime_type, \
                    $width, \
                    $height, \
                    DATETIME() \
                  )",
          params = {
            $category_id: category_id,
            $storage_backend_id: 1,
            $original_name: original_name,
            $display_name: display_name,
            $path: 'public/uploads',
            $file_name: file_name,
            $size: size,
            $mime_type: mime_type,
            $width: dimensions.width,
            $height: dimensions.height
          };

    db.run(query, params, function(error) {
      if (error) {
        next({template: 'upload', error: 'asdfasdfasdf'});
      }
    });
    response.render('upload', data);
  });
  app.use(function(error, request, response, next) {
      console.log(error);
  });
  return app;
}();
