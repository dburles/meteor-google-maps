Package.describe({
  name: 'dburles:google-maps',
  summary: 'Google Maps Javascript API v3',
  version: '1.1.5',
  git: 'https://github.com/dburles/meteor-google-maps.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['reactive-var', 'underscore']);
  api.use('templating', ['client', 'server'], { weak: true });
  api.addFiles('google-maps.js', 'client');
  api.export('GoogleMaps', 'client');

  if (Package['templating']) {
    api.addFiles('google-maps.html', 'client');
  }
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('dburles:google-maps');
  api.addFiles('google-maps-tests.js');
});
