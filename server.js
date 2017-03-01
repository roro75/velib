
var express = require('express');
var path = require('path');
var colors = require('colors');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var parseurl = require('parseurl');
var stringify = require('js-stringify');

var db = require('./db');
app.locals.pretty = true;
app.use("/pages", express.static(__dirname + '/pages'));
app.use("/img", express.static(__dirname + '/img'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.engine('pug', require('pug').__express);
app.set('view engine', 'pug');
app.set('views', 'pages');

app.get('/', function (req,res) {
       res.render('index', { titre:'Accueil'});
});

app.get('/liste', function(req, res){
        var collection = db.get().collection('paris');

        collection.find().sort({'name':1}).toArray(function(err, data){
            res.render('liste', {
                titre:'Liste des vélos dans Paris',
                data: data
            });
        });
});

app.get('/carte', function(req, res){
    var collection = db.get().collection('paris');

    collection.find().toArray(function(err, data){
        res.render('carte', {
            titre:'La carte',
            data: data
        });
    });
});

// 404 response
app.use(function(req, res, next) {
  res.status(404).render('404.pug', {
    documentTitle: 'Document non trouvé (Erreur 404)'
  });
});

// Setup MongoDB connection
var dbConfig = {
  dbName: 'velib',
  dbHost: 'localhost'
}


db.connect(dbConfig, function(err) {
  if (err) {
    console.log(colors.bold.bgRed('Unable to connect to database "' + dbConfig.dbName + '" on "' + dbConfig.dbHost + '"'));

    process.exit(1);
  } else {

    console.log(colors.bold.bgGreen('Connected to database "' + dbConfig.dbName + '" on "' + dbConfig.dbHost + '"'));

    // Create server and listen
    var server = app.listen(8080, function() {
      var serverHost = server.address().address;
      var serverPort = server.address().port;
      console.log(colors.bold.bgGreen(('Listening to ') + (serverHost) + (' on port ') + (serverPort)));
    }); // app.listen

  }
});
