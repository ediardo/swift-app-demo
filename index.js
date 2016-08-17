var express = require('express'),
    path = require('path'),
    port = 3000,
    logger = require('morgan'),
    router = express.Router(),
    index = require('./routes/index'),
    categories = require('./routes/categories'),
    upload = require('./routes/upload'),
    image = require('./routes/image'),
    admin = require('./routes/admin'),
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database('demo.db'),
    exphbs = require('express-handlebars'),
    sass = require('node-sass');


var app = express();

db.serialize(function () {

  // Storage Backends Table
  db.run("CREATE TABLE IF NOT EXISTS storage_backends ( \
            id INTEGER PRIMARY KEY, \
            name TEXT \
          )");

  // Categories Table
  db.run("CREATE TABLE IF NOT EXISTS categories ( \
            id INTEGER PRIMARY KEY, \
            name TEXT \
          )");

  // Images TABLE
  db.run("CREATE TABLE IF NOT EXISTS images ( \
            id INTEGER PRIMARY KEY, \
            storage_backend_id, \
            category_id, \
            original_name TEXT, \
            display_name TEXT, \
            path TEXT, \
            file_name TEXT, \
            size INTEGER, \
            created_at TEXT, \
            mime_type TEXT, \
            width INTEGER, \
            height INTEGER \
          )");

  // Image Categories
  db.all("SELECT * FROM categories", function (error, rows) {
    if (rows.length == 0) {
      db.run("INSERT INTO categories (id, name) VALUES (1, 'gif')");
      db.run("INSERT INTO categories (id, name) VALUES (2, 'static')");
      console.log('Categories Created');
    } else {
      console.log('There are ' + rows.length + ' Categories in the database.');
      console.log(rows);
    }
  });

  // Storage Backends
  db.all(`SELECT * FROM storage_backends`, function(error, rows) {
    if (rows.length == 0) {
      db.run(`INSERT INTO storage_backends (id, name) VALUES (1, 'server')`);
      db.run(`INSERT INTO storage_backends (id, name) VALUES (2, 'swift')`);
      console.log('Storage Backends Created');
    } else {
      console.log('There are ' + rows.length + ' Storage Backends');
      console.log(rows);
    }
  });

  // Show all images
  db.all("SELECT * FROM images", function (error, rows) {
    if (rows.length == 0) {
      console.log('There are no images');
    } else {
      console.log('There are ' + rows.length + ' image(s) in the database.')
      //console.log(rows)
    }
  });
});

app.engine('.hbs', exphbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');


app.use('/', index);
app.use('/categories', categories);
app.use('/image', image);
app.use('/upload', upload);
app.use('/admin', admin);
app.use('/public', express.static('public'));
app.listen(port, function() {
  console.log('Running...');
});
