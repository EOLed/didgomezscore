var i18n = require('i18n');

/*
 * GET home page.
 */

exports.index = function(req, res){
  var cookies = {};
  var locale = null;
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach(function( cookie ) {
      var parts = cookie.split('=');
      cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
      locale = _locale(cookies.locale);
      i18n.setLocale(locale);
    });
  }

  console.log('locale from cookie: ' + locale);

  _loadConfig(res, locale, _configLoaded);
};

exports.locale = function(req, res) {
  var locale = _locale(req.params.locale);
  res.setHeader('Set-Cookie', 'locale=' + locale);
  i18n.setLocale(locale);

  _loadConfig(res, locale, _configLoaded);
};

exports.admin = function(req, res) {
  res.render('admin');
};

exports.updateStatus = function(req, res) {
  var redis = require('redis');
  var redisClient = redis.createClient();
  redisClient.on('error', function (err) {
    console.error('There was an Error ' + err);
    res.redirect('/');
  });

  redisClient.on('connect', function() {
    redisClient.get('dgs:config:pw', function(err, reply) {
      redisClient.quit();
      _verifyPassword(req, res, reply);
    });
  });
};

function _verifyPassword(req, res, reply) {
  var crypto = require('crypto');
  var pw = crypto.createHash('md5').update(req.body.pw).digest("hex");
  if (pw == reply) {
    var redis = require('redis');
    var redisClient = redis.createClient();

    redisClient.on('error', function (err) {
      res.redirect('/');
    });

    redisClient.on('connect', function() {
      redisClient.set('dgs:config:scored', req.body.scored, function() {
        console.log('setting scored to: ' + req.body.scored);
        redisClient.quit();
        res.redirect('/');
      });
    });
  } else {
    res.redirect('/');
  }
}

function _loadConfig(res, locale, callback) {
  var ads = true, scored = false;

  var redis = require('redis');
  var redisClient = redis.createClient();
  
  redisClient.on('connect', function() {
    var multi = redisClient.multi();

    multi.get('dgs:config:ads', function (err, reply) {
      if (err) console.log('error occurred: ' + err); return;
    });

    multi.get('dgs:config:scored', function (err, reply) {
      if (err) console.log('error occurred: ' + err); return;
    });

    multi.exec(function (err, replies) {
      redisClient.quit();
      replies[0] = replies[0] === 'true';

      if (replies[1] == 'true' || replies[1] == 'false') {
        replies[1] = replies[1] === 'true';
      }

      callback(res, locale, { ads: replies[0], scored: replies[1] });
    });
  });
  
  redisClient.on('error', function (err) {
    callback(res, locale, { scored: scored, ads: ads });
  });
}

function _configLoaded(res, locale, config) {
  var redis = require('redis');
  var redisClient = redis.createClient();
  
  redisClient.on('connect', function() {
    redisClient.get('dgs:tweets', function(err, reply) {
      redisClient.quit();
      _tweetsLoaded(res, locale, config, JSON.parse(reply));
    });
  });
  
  redisClient.on('error', function(err) {
    _tweetsLoaded(res, locale, config, null);
  });
}

function _tweetsLoaded(res, locale, config, tweets) {
  var view = 'rip';

  /*if (config.scored == 'shutout' || config.scored == 'shootout') {
    view = config.scored;
  } else if (config.scored === true) {
    view = 'scored';
  }*/
  
  res.render(view, { otherLocale: _otherLocale(locale), config: config, tweets: tweets });
}

function _otherLocale(locale) {
  return locale == 'fr' ? 'en' : 'fr';
}

function _locale(locale) {
  return locale == 'fr' ? locale : 'en';
}
