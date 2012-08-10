var i18n = require('i18n');

/*
 * GET home page.
 */

exports.index = function(req, res){
  var cookies = {};
  req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
    var parts = cookie.split('=');
    cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
  });

  console.log('locale from cookie: ' + cookies['locale']);

  res.render('index', { otherLocale: _otherLocale(cookies['locale']) });
};

exports.locale = function(req, res) {
  var locale = _locale(req.params.locale);

  res.setHeader('Set-Cookie', 'locale=' + locale);

  i18n.setLocale(locale);

  res.render('index', { otherLocale: _otherLocale(locale) });
};

function _otherLocale(locale) {
  return locale != 'en' ? 'en' : 'fr';
}

function _locale(locale) {
  return locale == 'en' ? locale : 'fr';
}
