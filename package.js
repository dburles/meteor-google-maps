Package.describe({
  name: 'dburles:google-maps',
  summary: 'Google Maps Javascript API v3',
  version: '1.1.5',
  git: 'https://github.com/dburles/meteor-google-maps.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use([
    'templating',
    'reactive-var',
    'underscore']);
  api.addFiles([
    'google-maps.html',
    'google-maps.js'], 'client');
  api.export('GoogleMaps', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('dburles:google-maps');
  api.addFiles('google-maps-tests.js');
});
