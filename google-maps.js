GoogleMaps = {
  load: _.once(function(options) {
    options = options || {};
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
    'callback=GoogleMaps._initialize';
    if (options.libraries)
      script.src += '&libraries=' + options.libraries;
    if (options.key)
      script.src += '&key=' + options.key;
    document.body.appendChild(script);
  }),
  _loaded: new ReactiveVar(false),
  _created: new ReactiveDict(),
  loaded: function() {
    return this._loaded.get();
  },
  maps: {},
  _initialize: function() {
    this._loaded.set(true);
  },
  ready: function(name, cb) {
    if (_.isFunction(cb)) {
      var self = this;
      Template.instance().autorun(function() {
        if (GoogleMaps._created.get(name)) {
          cb(self.maps[name]);
        }
      });
    } // else throw error?
  },
  get: function(name) {
    return this.maps[name];
  },
  _create: function(name, options) {
    this.maps[name] = {
      instance: options.instance,
      options: options.options,
    };
    //helper is loaded & template is created
    this._created.set(name,true);
  }
};

Template.googleMap.rendered = function() {
  var self = this;
  self.autorun(function() {
    // if the api has loaded
    if (GoogleMaps.loaded()) {
      var data = Template.currentData();
      if (! data.name)
        throw new Meteor.Error("GoogleMaps - Missing argument: name");
      if ($.isEmptyObject(data.options))
        throw new Meteor.Error("GoogleMaps - Missing argument: options");
      if (!(data.options instanceof Object))
        throw new Meteor.Error("GoogleMaps - options argument is not an object");

      var canvas = self.$('.map-canvas').get(0);

      GoogleMaps._create(data.name, {
        instance: new google.maps.Map(canvas, data.options),
        options: data.options
      });
    }
  });
};
