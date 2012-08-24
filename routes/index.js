var i18n = require('i18n');

/*
 * GET home page.
 */

exports.index = function(req, res){
  var cookies = {};
  var locale = null;
  req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
    var parts = cookie.split('=');
    cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    locale = _locale(cookies['locale']);
    i18n.setLocale(locale);
  });

  console.log('locale from cookie: ' + locale);

  _loadConfig(res, locale, _configLoaded);
};

exports.locale = function(req, res) {
  var locale = _locale(req.params.locale);
  res.setHeader('Set-Cookie', 'locale=' + locale);
  i18n.setLocale(locale);

  _loadConfig(res, locale, _configLoaded);
};

function _loadConfig(res, locale, callback) {
  var ads = true, scored = false;

  var redis = require('redis');
  var redisClient = redis.createClient();
  redisClient.on('error', function (err) {
    console.error('There was an Error ' + err);
  });

  var multi = redisClient.multi();

  multi.get('dgs:config:ads', function (err, reply) {
    if (err) return;

    ads = reply == 'true' ? true : false;
  });

  multi.get('dgs:config:scored', function (err, reply) {
    if (err) return;

    if (reply == 'true') {
      reply = true;
    } else if (reply == 'false') {
      reply = false;
    }

    scored = reply;
  });

  multi.exec(function (err, replies) {
    var config = { scored: scored, ads: ads };
    console.log(config);
    callback(res, locale, config);

    if (err) return;
    redisClient.quit();
  });
}

function _configLoaded(res, locale, config) {
  var redis = require('redis');
  var redisClient = redis.createClient();
  redisClient.on('error', function (err) {
    console.error('There was an Error ' + err);
  });

  redisClient.get('dgs:tweets', function(err, reply) {
    _tweetsLoaded(res, locale, config, JSON.parse(reply));
    redisClient.quit();
  });
}

function _tweetsLoaded(res, locale, config, tweets) {
  var view = 'no';
  if (config.scored == 'shutout' || config.scored == 'shootout') {
    view = config.scored;
  } else if (config.scored == true) {
    view = 'scored';
  }
  
  console.log('render view: ' + view);

  res.render(view, { otherLocale: _otherLocale(locale), config: config, tweets: tweets });
}

function _otherLocale(locale) {
  return locale == 'fr' ? 'en' : 'fr';
}

function _locale(locale) {
  return locale == 'fr' ? locale : 'en';
}
