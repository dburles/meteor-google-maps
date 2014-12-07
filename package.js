Package.describe({
  name: 'dburles:google-maps',
  summary: 'Proper Google maps integration',
  version: '1.0.0',
  git: 'https://github.com/dburles/meteor-google-maps.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['templating', 'reactive-var']);
  api.addFiles([
    'google-maps.html',
    'google-maps.js'], 'client');
  api.export('GoogleMaps', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('google-maps');
  api.addFiles('google-maps-tests.js');
});
