/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  i18n = require('i18n');

i18n.configure({
  locales: ['en','fr']
});

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(i18n.init);
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/:locale', routes.locale);

app.locals({
  __i: i18n.__,
  __n: i18n.__n
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
  setInterval(function() {
    var url = 'http://search.twitter.com/search.json?q=didgomezscore&rpp=12&include_entities=true&result_type=mixed';
    http.get(url, function (res) {
      var data = '';
      res.on('data', function(chunk) {
        data += chunk;
      });

      res.on('end', function() {
        console.log('data: ' + data);
        var redis = require('redis');
        var redisClient = redis.createClient();
        redisClient.on('error', function (err) {
          console.error('There was an Error ' + err);
        });

        redisClient.set('dgs:tweets', data, redis.print);
        redisClient.quit(function(err, res) {
          console.log('closing redis client.');
        });
      });
    });
  }, 30000);
});
